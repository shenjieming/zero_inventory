export default {
  namespaced: true,
  state: {
    // 用户详情
    userInfo: {}
  },
  mutations: {
    SET_USERINFO (state, userInfo) {
      state.userInfo = userInfo
    }
  }
}
