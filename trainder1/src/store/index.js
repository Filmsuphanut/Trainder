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
        notification: [],
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
            console.log("previous store = " + value);
        },
        setUserData(state, value) {
            Vue.set(state.user, "data", value);
        },
        setUser(state, value) {
            Vue.set(state, "user", value);
        },
        clearFriendLists(state) {
            Vue.set(state, "friendList", {})
        },
        setFriendLists(state, value) {
            Vue.set(state.friendList, value.id, value.data);
        },
        setNotification(state, value) {
            Vue.set(state, "notification", value)
        }
    },
    actions: {
        logout(context) {
            context.commit("setUser", {
                // token: null,
                data: "",
            });
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
            context.commit("clearFriendLists")
            let prom = new Promise(async(resolve, reject) => {
                try {
                    let res = await axios.get(
                        `${endpoint}/allFriends/${context.state.user.data.uid}`
                    );
                    let FL = [];
                    let friends = res.data;
                    for (let i = 0; i < friends.length; ++i) {
                        let f = friends[i];
                        let log = await axios.get(
                            `${endpoint}/getLogByUID/${context.state.user.data.uid}&${f.id}`
                        );
                        context.commit("setFriendLists", {
                            id: f.id,
                            data: {
                                data: f,
                                logs: log.data.logId,
                            }
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
                    context.commit("setNotification", res.data)
                    resolve(res);
                } catch (err) {
                    console.log(err);
                    reject(false);
                }
            });
            return prom;
        },
        async updateNoti(context, value) {
            try {
                let res = await axios.put("updateNoti", {
                    userId: context.state.user.data.uid,
                    notification: value
                })
                console.log(res.data)
            } catch (err) {
                alert(err)
            }
        }
    },
    getters: {
        userData(state) {
            return state.user.data;
        },
        friendLists(state) {
            return state.friendList;
        },
        notification(state) {
            return state.notification
        }
    },
    modules: {
        fb,
    },
    plugins: [new VuexPersistence().plugin],
});