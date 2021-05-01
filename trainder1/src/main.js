import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import VueAxios from "vue-axios";
import axios from "axios";
import '../src/axios'

import PortalVue from 'portal-vue'

import { fb } from "./firebase"

Vue.config.productionTip = false
Vue.use(PortalVue)



new Vue({
    router,
    store,
    vuetify,
    VueAxios,
    axios,
    render: h => h(App)
}).$mount('#app')