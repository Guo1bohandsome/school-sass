import router from '@/router' //权限拦截在路由跳转 导航守卫
import store from '@/store' //引入vuex store实例
import NProgress from 'nprogress'
//不需要导出 因为只需要让代码执行即可
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
    NProgress.start() // 开启进度条
    if (store.getters.token) {
      if (to.path === '/login') {
        next('/') //跳到主页
      } else {
        if (!store.getters.userId) {
          await store.dispatch('user/getUserInfo')
        }
        next()
      }
    } else {
      if (whiteList.indexOf(to.path) > -1) {
        //如果找到了，就表示在名单里
        next()
      } else {
        next('/login')
      }
    }
    NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题

  }) //前置守卫
  //next是前置守卫必须要执行的钩子函数，next必须执行，不执行页面就会无响应
  //next() 放过
  //next(false)跳转中止
  //next(地址)跳转到某个地址
  // 后置守卫
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})