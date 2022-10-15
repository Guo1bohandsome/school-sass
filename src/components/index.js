// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools/index.vue'
import UploadExcel from './UploadExcel/index.vue'
import ImageUpload from './ImageUpload/index.vue'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools), //第一个是组件名称，第二个是组件对象
      Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
  }
}