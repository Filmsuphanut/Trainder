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
        user_course: [],
        previous: {
            pre: "/",
        },
        events: [],
        tableid: "",
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
            // Vue.set(state, "course", value)
            state.course.push(value)
        },
        pushUsercourse(state, value) {
            //console.log("here")
            state.user_course.push(value)
                // Vue.set(state, "user_course", value)
        },
        clearUsercourse(state) {
            //console.log("here")
            Vue.set(state, "user_course", [])
        },
        setTableEvent(state, value) {
            Vue.set(state, "events", value);
        },
        setTableid(state, value) {
            Vue.set(state, "tableid", value);
        },
        // clearTableEvent(state){
        //     Vue.set(state,"events",[]);
        // },
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
                //////////////////course
            Vue.set(state, "course", []);
            Vue.set(state, "user_course", []);
            ///////////////////table
            Vue.set(state, "events", []);
            Vue.set(state, "tableid", "");
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
                //let user = context.state.user.data.data;
            let docid = context.state.user.data.uid

            let courseRef = db.collection("Course");
            let trainerCourse = await courseRef.where("creator", "==", docid).get();
            // //let CourseDocid;
            let coursedocid;

            trainerCourse.forEach((doc) => {
                coursedocid = doc.id;
                let d = { docId: doc.id, ...doc.data() };
                d.event = [];

                courseRef.doc(coursedocid).collection("Event").get().then((courseEvent) => {
                    courseEvent.forEach(docevent => {
                        d.event.push(docevent.data())
                    })
                    context.commit("pushCourse", d);
                })
            });
            // CourseEvent.forEach(doc => {
            //     //console.log(doc.data())
            //     course_data.event.push(doc.data());
            // })

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

        async fetchUser_course(context) {
            context.commit("clearUsercourse");
            let user = context.state.user.data;
            let courseRef = await db.collection("Course").get();
            let userRef = db.collection("userData");

            courseRef.forEach((doc) => {
                let member = doc.data().member;

                if (member.includes(user.uid)) {
                    let buff = {...doc.data() };
                    buff.creatorname = "";
                    //console.log(buff.creator);
                    userRef.doc(buff.creator).get().then(userData => {
                        buff.creatorname = userData.data().fullName;
                        context.commit("pushUsercourse", buff);
                    })
                }
            });

        },

        async getTableEvents(context) {

            let user = context.state.user.data.data;

            let uid = user.uid;
            let tableRef = db.collection("Table");
            let userData = await tableRef.where("uid", "==", uid).get();
            let eventbuff = [];

            userData.forEach((doc) => {
                context.commit("setTableid", doc.id); // <--
                //console.log(doc.id, '=>', doc.data());
            });

            let userEvent = await tableRef.doc(context.state.tableid).collection("Event").get();

            userEvent.forEach(doc => {

                //console.log(doc.id, " => ", doc.data());
                if (JSON.stringify(doc.data()) != "{}") {
                    let EventData = doc.data();
                    EventData.id = doc.id;
                    eventbuff.push(EventData); // <--
                }
            });

            context.commit("setTableEvent", []);
            context.commit("setTableEvent", eventbuff);
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
        },
        course(state) {
            return state.course;
        },
        user_course(state) {
            return state.user_course;
        },
        Table_events(state) {
            return state.events;
        },
    },
    modules: {
        fb,
    },
    plugins: [new VuexPersistence().plugin],
});