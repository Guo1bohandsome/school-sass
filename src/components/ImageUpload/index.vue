<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :file-list="fileList"
      :on-preview="preview"
      :class="{displayNone:fileComputed}"
    >
      <!-- 给这个组件自定义一个class,为true的时候就显示,否则就不显示 -->
      <!-- 第一步 limit是限制上传文件的数量 -->
      <!--第二步 action是必选参数，要上传的地址 ，但是我们用action解决不了，我们要上传到腾讯云cors-->
      <!-- 第三步 file-list例如:（[{name:'food.jpg',url:'https://xxx.xxxx.jpg'}] ）是上传的文件列表，可以绑定到上传组件上，让上传组件来显示-->
      <!-- 第四步 我们想要预览，on-preview指点击文件列表中已上传文件时的钩子 ，它的参数是file，-->
      <!-- 第五步：弹出一个组件 -->
      <!-- 第六步：当我们点击url时会把url地址传给弹窗组件 -->
      <i class="
    el-icon-plus"></i>
    </el-upload>
    <el-dialog
      :visible="showDialog"
      title="图片预览"
      @close="showDialog=false"
    >
      <img
        :src="imgUrl"
        alt=""
        style="width: 100%;"
      >
    </el-dialog>
  </div>

</template>

<script>
export default {
  data() {
    return {
      fileList: [{ url: 'https://www.baidu.com/img/pc_79bff59263430e2e42693b50cf376490.png' }],
      showDialog: false,
      imgUrl: ''
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      console.log(file)
      //此处得到的是status: "success";uid: 1665754918103;url: "https://www.baidu.com/img/pc_79bff59263430e2e42693b50cf376490.png"
      this.imgUrl = file.url
      this.showDialog = true
    }
  }
}
</script>

<style>
.displayNone .el-upload--picture-card {
  display: none;
}
</style>