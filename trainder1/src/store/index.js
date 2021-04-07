import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state:{//data
    user : {token:null},
    previous : {pre:"/"}
  },
  mutations:{//
    setToken(state,value){
      Vue.set(state.user,"token",value)
      console.log('user store = ' + value)
    },
    setPreviousPage(state,value){
      Vue.set(state.previous,"pre",value)
      console.log('previous store = ' + value)
    }
  },
  actions:{//methods
  },
  modules: {
  }
})
