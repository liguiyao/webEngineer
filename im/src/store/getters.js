const getters = {
  // 用户Loginstate
  loginStatus: state => state.user.loginStatus,

  // socket 连接state
  socketStatus: state => state.socketStatus,
}

export default getters
