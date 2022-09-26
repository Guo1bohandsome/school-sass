import { getToken, setToken, removeToken, setTimeStamp, getTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
//状态
const state = {
    token: getToken(),
    userInfo: {}
  }
  // 修改状态
const mutations = {
    setToken(state, token) {
      state.token = token //将数据设置给vuex
      setToken(token)
    },
    removeToken(state) {
      state.token = null //将vuex数据置空
      removeToken() //同步到缓存
    },
    setUserInfo(state, result) {
      state.userInfo = {...result }
    },
    // 删除用户信息
    reomveUserInfo(state) {
      state.userInfo = {}
    }
  }
  // 执行异步
const actions = {
  async login(store, data) {
    //调用api接口
    const result = await login(data);
    console.log(result);
    //axios默认加了一层data
    // if (result.data.success) {
    //若为true，表示登录成功，但这里因为在响应拦截器中处理过了
    store.commit('setToken', result)
    setTimeStamp() //设置当前时间戳
  },
  async getUserInfo(store) {
    const result = await getUserInfo() //获取返回值，不需要再写参数，token已经在请求拦截器中注入
    console.log(result);
    const baseInfo = await getUserDetailById(result.userId) //获取用户的详情数据
    console.log(baseInfo);
    store.commit('setUserInfo', {...result, ...baseInfo });
    //把调用用户资料和用户详情同样提交到mutations
    return result
      //这里为什么用return返回result，是因为我们后期做权限的时候，留下伏笔
  },
  async logout(store) {
    store.commit('removeToken')
    store.commit('removeUserInfo')
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}