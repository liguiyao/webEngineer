// 根级别的 mutation
const mutations = {
  // 更新socket 连接state
  UPDATE_SOCKET_STATUS(state, status) {
    state.socketStatus = status
  },
}

export default mutations
