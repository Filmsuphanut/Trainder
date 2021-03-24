import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state:{//data
    user : {token:null},
  },
  mutations:{//
    setToken(state,value){
      Vue.set(state.user,"token",value)
      console.log('store' + value)
    },
  },
  actions:{//methods
  },
  modules: {
  }
})
