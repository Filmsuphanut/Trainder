import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state:{//data
    user : {uid:""}
  },
  mutations:{//
    setUid(state,value){
      Vue.set(state.user,"uid",value)
      console.log(value)
    }
  },
  actions:{//methods
  },
  modules: {
  }
})
