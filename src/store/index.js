import Vue from 'vue'
import Vuex from 'vuex'
import { getUserInfo } from '@/api/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      username: "",
      avatar: ""
    }
  },
  getters: {
  },
  mutations: {
    setUserInfo(state, userInfo){
      state.userInfo = userInfo
    }
  },
  actions: {
    async updateUserInfo(context){
      const {data} = await getUserInfo()
      const userInfo = {username: data.data.username, avatar: data.data.avatar}
      context.commit('setUserInfo', userInfo)
    }
  },
  modules: {
  }
})
