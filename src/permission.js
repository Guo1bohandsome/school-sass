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
          const { roles } = await store.dispatch('user/getUserInfo')
            //如果后续需要根据用户资料获取数据，这里必须改成同步
            //筛选用户可用的路由
          const routes = await store.dispatch('permission/filterRoutes', roles.menus)
            //筛选得到当前用户可用的动态路由
          router.addRoutes([...routes], { path: '*', redirect: '/404', hidden: true }, ) //执行完addRoutes，必须用next(地址)，不能用next()
            //添加动态路由到路由表,因为默认路由表中只有静态路由，addRoutes必须用next(地址) 不能用next()
          next(to.path) //相当于跳到对应的地址 相当于多做一次跳转。为什么？因为路还没铺好就进去了会出错
            //如果进行了addRoutes请用next(to.path) 否则会导致刷新路由权限失败 这是一个一已知缺陷
        } else {
          next()
        }

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