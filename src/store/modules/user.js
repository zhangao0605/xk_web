import { getToken, setToken, removeToken } from '../../utils/token'
import userApi from '../../apis/userApi'
import storage from '../../utils/storage'

const state = {
  // 用户登录状态唯一标识
  token: getToken(),

  // 用户信息
  userInfo: {},

  // 权限列表
  permissionList: [],

  // 最后登录时间
  loginLastTime: sessionStorage.getItem('loginLastTime') - 0
}

const getters = {
  isLogin(state) {
    return !!state.token
  }
}

const mutations = {
  // 设置token
  SET_TOKEN(state, token) {
    setToken(token)
    state.token = token
  },
  // 移除token
  REMOVE_TOKEN(state) {
    removeToken()
    state.token = null
  },

  SET_USER_INFO(state) {
    state.userInfo = state
  },
  REMOVE_USER_INFO(state) {
    state.userInfo = {}
  },
  // 设置权限列表
  SET_PERMISSION_LIST(state, list) {
    state.permissionList = list
  },
  // 删除权限列表
  REMOVE_PERMISSION_LIST(state) {
    state.permissionList = null
  }
}

const actions = {
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      let protocol = location.protocol;
      let host = location.host;
      location.href = protocol + '//' + host + '/#/login';
      commit('REMOVE_TOKEN');
      commit('REMOVE_USER_INFO');
      resolve()
    })
  },
  logOutByApi({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // 直接调一下接口，不用管后端的返回
      userApi.logout().then(() => {
        //TODO
      }).catch(error => {
        //TODO
      })
      dispatch('logout')
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
