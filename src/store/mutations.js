export default {
  changeMenuData (state, data) {
    state.menuData = state.menuData.slice(0)
    state.menuData = data
  },
  changeShowOneOrSeond (state, data) {
    state.showOneOrSeond = data
  },
  changeMenuSideData (state, data) {
    state.sideData = data
  },
  changeName (state, data) {
    state.userName = data
  },
  currentJoinPerson (state, data) {
    state.joinPerson = []
    data.forEach(ele => {
      state.joinPerson.push(ele)
    })
  },
  updateCurrentJoinPerson (state, data) {
    state.joinPerson.splice(data, 1)
    state.prePerson.splice(data, 1)
  },
  changeprePerson (state, data) {
    state.prePerson.push(data)
  },
  transformPrePerson (state, data) {
    state.prePerson = []
    data.forEach(ele => {
      state.prePerson.push(ele)
    })
  },
  editPrePerson (state, data) {
    state.prePerson.splice(data.startIndex, data.deleteCount)
  },
  deleteAllJoinPerson (state, data) {
    state.joinPerson.splice(data.startDelete, data.endDelete)
    state.prePerson.splice(data.startDelete, data.endDelete)
  },
  changeActiveName (state, data) {
    state.activeName = data
  },
  refreshData (state, data) {
    state.isRefresh = data
  },
  bellRed (state, data) {
    state.showRedDot = data
  },
  // 显示推送消息未读数量
  changeNoRead (state, data) {
    state.noRead = data
  },
  // 未读数量减少
  miniusNoRead (state, data) {
    state.noRead -= 1
  }
}
