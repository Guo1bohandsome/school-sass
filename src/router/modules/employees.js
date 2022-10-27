// 导出属于员工的路由规则
import Layout from '@/layout'
//  {  path: '', component: '' }
// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default {
  path: '/employees', // 路径
  name: 'employees', // 给路由规则加一个name，此属性会在后面做权限时用到
  component: Layout, // 组件
  // 配置二级路的路由表
  children: [{
      path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
      component: () =>
        import ('@/views/employees'),
      // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
      meta: {
        title: '员工管理',
        // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 
        //因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
        icon: 'people'
      }
    },
    {
      path: 'detail/:id',
      //通过id动态路由传参，如果我们的地址是/employees/detail/123,我们就可以访问，如果不写123就不能访问
      //所以这里必须要有id，如果想有id能访问，没id也能访问，
      //我们就可以在id后面加“？”号，依此来决定参数传不穿
      component: () =>
        import ('@/views/employees/detail'),
      hidden: true,
      //不写这个的话，因为多了两个子节点，两个子节点都要去显示，冲突后，就不显示上面默认的标题了
      //为了显示，我们要把这个子节点隐藏
      meta: {
        tiltle: '员工详情'
      }
    },
    {
      path: 'print/:id',
      component: () =>
        import ('@/views/employees/print'),
      hidden: true,
      meta: {
        title: '员工打印'
      }
    }
  ]
}

// 当你的访问地址 是 /employees的时候 layout组件会显示 此时 你的二级路由的默认组件  也会显示