import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'


//import VueAxios from "vue-axios";
//import axios from "axios";
import '../src/axios'



import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyAU1X0QK3_aF-J6_g_KBtVs5gh3wXTPGYI",
  authDomain: "fir-b9dbd.firebaseapp.com",
  projectId: "fir-b9dbd",
  storageBucket: "fir-b9dbd.appspot.com",
  messagingSenderId: "243504793880",
  appId: "1:243504793880:web:0146fa89c7dc2f3c65b66d",
  measurementId: "G-JNBVT0RB4K"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  //VueAxios,
  //axios,
  render: h => h(App)
}).$mount('#app')
