import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import {
    fb
} from "../firebase";
const db = fb.firestore();
import axios from "axios";
Vue.use(Vuex);

let endpoint = process.env.VUE_APP_ENDPOINT;

export default new Vuex.Store({
    state: {
        //data
        user: {
            // token: null,
            data: "",
        },
        friendList: {},
        chatSetting: {
            event: false,
        },
        notification: [],
        course: [],
        previous: {
            pre: "/",
        },
    },
    mutations: {
        //
        // setToken(state, value) {
        //     Vue.set(state.user, "token", value);
        //     console.log("user store = " + value);
        // },
        setPreviousPage(state, value) {
            Vue.set(state.previous, "pre", value);
        },
        setUserData(state, value) {
            Vue.set(state.user, "data", value);
        },
        setUser(state, value) {
            Vue.set(state, "user", value);
        },
        clearFriendLists(state) {
            Vue.set(state, "friendList", {});
        },
        setFriendLists(state, value) {
            Vue.set(state.friendList, value.id, value.data);
        },
        setNotification(state, value) {
            Vue.set(state, "notification", value);
        },
        setLogs(state, value) {
            Vue.set(state.friendList[value.id], "logs", value.logs)
        },
        setChatEvent(state, value) {
            Vue.set(state.chatSetting, "event", value)
        },
        clearCourse(state) {
            Vue.set(state, "course", [])
        },
        pushCourse(state, value) {
            state.course.push(value)
        },
        clearAll(state) {
            Vue.set(state, "user", {
                data: ""
            })
            Vue.set(state, "friendList", {})
            Vue.set(state, "chatSetting", {
                event: false,
            })
            Vue.set(state, "notification", [])
            Vue.set(state, "previous", {
                pre: "/",
            })

        }
    },
    actions: {
        logout(context) {
            context.commit("clearAll");
        },
        report(context, value) {
            let prom = new Promise(async(resolve, reject) => {
                try {
                    let docRef = db.collection("report");
                    let res = await docRef.add(value);
                    resolve(true);
                } catch (err) {
                    console.log(err);
                    reject(false);
                }
            });
            return prom;
        },
        fetchFriends(context) {
            context.commit("clearFriendLists");
            let prom = new Promise(async(resolve, reject) => {
                try {
                    let res = await axios.get(
                        `${endpoint}/allFriends/${context.state.user.data.uid}`
                    );

                    let friends = res.data;
                    for (let i = 0; i < friends.length; ++i) {
                        let f = friends[i];
                        let log = await axios.get(
                            `${endpoint}/getLogByUID/${context.state.user.data.uid}&${f.id}`
                        );

                        db.collection("chat-logs")
                            .doc(log.data.logId)
                            .onSnapshot((doc) => {
                                // console.log("Current data: ", doc.data());
                                let logs = doc.data().logs;
                                context.commit("setLogs", {
                                    id: f.id,
                                    logs: logs,
                                })
                                context.commit("setChatEvent", true)
                            });

                        context.commit("setFriendLists", {
                            id: f.id,
                            data: {
                                data: f,
                                logsId: log.data.logId,
                            },
                        });
                    }
                    resolve(res);
                } catch (err) {
                    console.log(err);
                    reject(false);
                }
            });
            return prom;
        },
        fetchNotication(context) {
            let prom = new Promise(async(resolve, reject) => {
                try {
                    let res = await axios.get(
                        `getAllNoti/${context.state.user.data.uid}`
                    );
                    // var data = []
                    // let allNoti = res.data
                    // for (let i = 0; i < allNoti.length; ++i) {
                    //     let noti = allNoti[i]
                    //     db.collection("userData").doc(noti.sender).get().then(who => {
                    //         data.push({
                    //             img: who.data().profilePic,
                    //             name: who.data().fullName,
                    //             msg: noti.msg
                    //         })
                    //     })
                    // }
                    if (res.data == "There no notification") res.data = []
                    context.commit("setNotification", res.data);
                    resolve(res);
                } catch (err) {
                    console.log(err);
                    reject(false);
                }
            });
            return prom;
        },
        async fetchCourse(context) {
            context.commit("clearCourse")
            let user = context.state.user.data;
            let courseRef = db.collection("Course");
            let trainerCourse = await courseRef.where("creator", "==", user.uid).get();
            //let CourseDocid;
            trainerCourse.forEach((doc) => {
                console.log(doc.data())
                context.commit("pushCourse", { id: doc.id, ...doc.data() })
            });
        },
        async updateNoti(context, value) {
            try {
                let res = await axios.put("updateNoti", {
                    userId: context.state.user.data.uid,
                    notification: value,
                });
            } catch (err) {
                alert(err);
            }
        },
    },
    getters: {
        userData(state) {
            return state.user.data;
        },
        friendLists(state) {
            return state.friendList;
        },
        notification(state) {
            return state.notification;
        },
        logs: (state) => (id) => {
            return state.friendList[id].logs
        },
        chatEvent(state) {
            return state.chatSetting.event
        },
        getLastChat: (state) => (id) => {
            if (state.friendList[id].logs) {
                let last = [...state.friendList[id].logs]
                return last.splice(last.length - 1, 1)
            } else {
                return ""
            }
        },
        getDataById: (state) => (id) => {
            return state.friendList[id]
        },
        userRole(state) {
            return state.user.data.data.role
        }
    },
    modules: {
        fb,
    },
    plugins: [new VuexPersistence().plugin],
});