import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //data
        user: {
            token: null,
            data: "",
        },
        previous: {
            pre: "/",
        },
    },
    mutations: {
        //
        setToken(state, value) {
            Vue.set(state.user, "token", value);
            console.log("user store = " + value);
        },
        setPreviousPage(state, value) {
            Vue.set(state.previous, "pre", value);
            console.log("previous store = " + value);
        },
        setUserData(state, value) {
            Vue.set(state.user, "data", value);
        },
        setUser(state, value) {
            Vue.set(state, "user", value)
        }
    },
    actions: {
        //methods
        logout(context) {
            context.commit("setUser", {
                token: null,
                data: "",
            });
        },
    },
    getters: {
        userData(state) {
            return state.user.data;
        },
    },
    modules: {},
    plugins: [new VuexPersistence().plugin],
});