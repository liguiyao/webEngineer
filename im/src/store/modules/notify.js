export default {
  state: {
    // 聊天消息未读数
    unreadNum: 0,

    // 好友Apply  未读数
    applyNum: 0,

    // 好友键盘事件监听
    inputEvent: 0,

    // 好友Loginstate监听
    friendStatus: {
      // Loginstate[0:下线;1:在线;]
      status: 0,
      // 好友ID
      friend_id: 0,
    },
  },
  mutations: {
    // 消息未读数自增
    INCR_UNREAD_NUM(state) {
      console.log("触发消息未读")
      state.unreadNum++
    },

    // 好友Apply  事件监听
    INCR_APPLY_NUM(state) {
      state.applyNum++
    },

    // 设置消息未读数
    SET_UNREAD_NUM(state, value) {
      state.unreadNum = value
    },

    // 好友Apply  事件监听
    SET_APPLY_NUM(state, value) {
      state.applyNum = value
    },

    // 自增好友键盘输入事件
    UPDATE_KEYBOARD_EVENT(state) {
      state.inputEvent++
    },

    // 更新好友Loginstate
    UPDATE_FRIEND_STATUS(state, value) {
      state.friendStatus = value
    },
  },
  actions: {
    ACT_UPDATE_FRIEND_STATUS({ commit }, value) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit('UPDATE_FRIEND_STATUS', value)
          resolve()
        }, 0)
      })
    },
  },
}
