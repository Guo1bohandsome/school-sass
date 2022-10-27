// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import { config } from '@vue/test-utils'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
import router from '@/router'
const TimeOut = 3600
const servic = axios.create({
    //当执行npm run dev=>.env.development=>/api=>跨域代理
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 85000
  }) // 创建一个axios的实例
servic.interceptors.request.use(config => {
    if (store.getters.token) {
      //只有在有token的情况下，才有必要去检查时间戳是否超时
      if (IsCheckTimeout()) {
        //如果为true表示过期，此山是token没用
        store.dispatch('user/logout') //登出操作
        router.push('/login')
        return Promise.reject(new Error('token过期，请重新登录'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }

    return config //必须返回配置
  }, error => {
    return Promise.reject(error)
  }) // 请求拦截器
servic.interceptors.response.use(
    response => {
      const { success, message, data } = response.data
        //要根据输入用户或者密码，success的成功与否决定下面的操作
      if (success) {
        return data
      } else {
        //业务已经错误 不能进then 应该进catch
        Message.error(message) //提示错误消息
        return Promise.reject(new Error(message))
      }
    }, error => {
      // Message.error(error.message) //提示错误信息
      // return Promise.reject(Error) //返回执行错误 让当前的执行链跳出成功 直接进入catch
      // error 信息 里面 response的对象
      if (error.response && error.response.data && error.response.data.code === 10002) {
        // 当等于10002的时候 表示 后端告诉我token超时了
        store.dispatch('user/logout') // 登出action 删除token
        router.push('/login')
        return Promise.reject(new Error('请重新登录'))
      } else {
        Message.error(error.message) // 提示错误信息
      }
      return Promise.reject(error)
    }
  ) // 响应拦截器
function IsCheckTimeout() {
  var currentTime = Date.now() //当前时间戳
  var timeStamp = getTimeStamp() //缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default servic // 导出axios实例