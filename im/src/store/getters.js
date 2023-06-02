const getters = {
  // 用户Login状态
  loginStatus: state => state.user.loginStatus,

  // socket 连接状态
  socketStatus: state => state.socketStatus,
}

export default getters
