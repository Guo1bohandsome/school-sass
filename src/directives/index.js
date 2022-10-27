//负责管理所有的自定义指令
export const imageerror = {
  //指令对象 会在当前的dom元素插入到结点之后执行
  inserted(dom, options) {
    //options是指令中的变量的解释   其中有一个属性叫做value
    //dom 表示当前指令作用的dom对象
    //dom此时就是图片
    dom.src = dom.src || options.value //初始化时，如果有值则赋值 ,若没值则需要进行默认值赋值就给后面的值
      //当图片有地址，但是地址没有加载成功时 会报错 会触发图片的一个事件 =>   onerror
    dom.onerror = function() {
      //当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      //dom可以注册error事件
      dom.src = options.value
    }
  },
  //该函数同inserted一样同为钩子函数
  componentUpdated() {
    //该钩子函数会在当前指令作用的组件 更新数据完毕后后 执行
    //inserted只会执行一次
    //组件初始化 一旦更新就不会再进入inserted函数，而会进入componentUpdated
    dom.src = dom.src || options.value
    dom.onerror = function() {
      //当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      //dom可以注册error事件
      dom.src = options.value
    }
  }
}