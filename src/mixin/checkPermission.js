import store from '@/store' //把vuex的store拿过来
//做一个混入对象
export default {
  //混入对象是组件的选项对象
  methods: {
    //检查权限 要么有 要么没有 key就是要检查的点
    checkPermission(key) {
      //去用户的信息里面找points中有没有key 如果有key，认为有权限。如果没有key则认为不能点击
      // store.state.user.userInfo.roles.points 
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        userInfo.roles.points.some(item => item === key)
          //some() 方法会依次执行数组的每个元素：
          // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
          // 如果没有满足条件的元素，则返回false。
      }
      return false //如果连if都没进去，说明没权限
    }
  }
}