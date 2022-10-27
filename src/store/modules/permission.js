//专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router' //引入静态路由
const state = {
  //一开始肯定拥有静态路由的权限
  routes: constantRoutes //路由表表示当前用户所拥有的所有路由的数组
}
const mutations = {
  //定义修改routes的mutations
  //payload认为是我们登陆成功需要添加的新路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes];
    //每次都是在静态路由的基础上去加新的路由，不能再原有基础上加
  }
}
const actions = {
  //筛选权限路由
  filterRoutes(store, menus) {
    const routes = []
      //筛选出动态路由中和menus中能够对上的路由
      //第二个参数为当前用户的所拥有的菜单权限
      //asyncRoutes是所有的动态路由 
    menus.forEach(key => {

        //key就是标识
        //在asyncRoutes找有没有对象中的name属性等于key的如果找不到就没权限
        //找到了就筛选出来
        routes.push(...asyncRoutes.filter(item => item.name === key))
          //得到一个数组，有可能有元素，也有可能是空数组
          //数组push进数组，必须拷贝...
      })
      //这个routes就是当前用户所拥有的动态路由的权限
    store.commit('setRoutes', routes) //将动态路由提交给mutations
    return routes //这里还要用return，是因为state数据是用来显示左侧菜单用的
      //这个是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}