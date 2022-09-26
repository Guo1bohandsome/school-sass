const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, //建立token的快捷访问
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto
    // 建立用户id的映射
}
export default getters