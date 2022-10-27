<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="handleRemove"
      :class="{displayNone:fileComputed}"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <!-- 给这个组件自定义一个名为displayNone的值,为true的时候就显示,否则就不显示 -->
      <!-- 第一步 limit是限制上传文件的数量 -->
      <!--第二步 action是必选参数，要上传的地址 ，但是我们用action解决不了，我们要上传到腾讯云cors-->
      <!-- 第三步 file-list例如:（[{name:'food.jpg',url:'https://xxx.xxxx.jpg'}] ）是上传的文件列表，可以绑定到上传组件上，让上传组件来显示-->
      <!-- 第四步 我们想要预览，on-preview指点击文件列表中已上传文件时的钩子 ，它的参数是file，-->
      <!-- 第五步：弹出一个组件 -->
      <!-- 第六步：当我们点击url时会把url地址传给弹窗组件 -->

      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />

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
import COS from 'cos-js-sdk-v5' //引入腾讯云的cos包
//实例化COS对象,后面上传所需要的
const cos = new COS({
  SecretId: 'AKID89yay9F7k8HEwPdcMrAH9mAKm23pLcha',
  SecretKey: 'iBQQBzBBwoV0HK8h03uYx87vYzEJExVt'
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null, //记录当前上传的Uid
      percent: 0, //记录当前进度百分比
      showPercent: false //默认不显示
    }
  },
  computed: {
    fileComputed() {
      //当我们的fileList文件夹的对象长度为零时，就返回一个true值
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      console.log(file)
      //此处得到的是status: "success";uid: 1665754918103;url: "https://www.baidu.com/img/pc_79bff59263430e2e42693b50cf376490.png"
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      console.log(file) //file是要删除的文件，uid用来标识要删除的文件
      console.log(fileList) //fileList是删除过后的文件
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid) //将当前的删除文件排除在外
      this.fileList = fileList //这种方法都可以
      console.log(fileList)
    },
    //因为upload显示的是fileList文件，上面我们已经把fileList问价中的图片删除了，所以整个upload都不会显示，我们得把加入的图片重新放入fileList中去
    changeFile(file, fileList) {
      //这个钩子函数会执行多次，因为添加文件一次，成功失败又一次，所以我们不能把图片文件直接push进数组
      //file是当前文件 fileList是当前的最新数组 this.fileList
      console.log(123)
      console.log(file)
      console.log(fileList)
      console.log(fileList.length) //第一次是1第二次是0，因为第一次添加文件的时候有一个一闪而过的图片，第二次则是因为fileList没加到dileLisst文件里去，还是没值
      // this.fileList = fileList.push(file) //我们把一张图压进去两次，所以我们加一个判断，会打印两张图片，因为file打印了两次
      // if (!this.fileList.some(item => item.uid === file.uid)) {//判断fileList文件里面是否有和file.uid，没有该文件则追加，但是还是报错！！！
      // this.fileList = fileList.push(file)
      // }
      this.fileList = fileList.map(item => item) //第一次长度是1，第二次长度是0.上传失败是因为action地址为空。因为现在还没有上传，所以第二次进来的数据一定是个空值
      // 如果完成了上传动作，第一次进入和第二次进入的fileList长度都是1 都有数据
    },
    beforeUpload(file) {
      console.log(file) //先检查文件类型
      const types = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
      if (!types.some(item => item === file.type)) {
        //如果不存在
        this.$message.error('上传图片只能是JPG、GIF、BMP、PNG格式！')
        return false //上传终止
      }
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('上传图片大小不能大于10M')
        return false
      }
      this.showPercent = true //当我们确定要上传时，显示这个进度条组件
      console.log(file) //当我们确定要上传时，我们把这个file的uid记下来，并保存到currentFileUid
      this.currentFileUid = file.uid

      return true //如果不return一个true，会认为ruturn了一个undefined（还是false），最后一定要return一个true，这样才会认为可以继续上传
    },
    upload(params) {
      //进行上传操作
      console.log(params) //拿到上传的文件，并调用腾讯云上传地址
      console.log(params.file)
      if (params.file) {
        //执行上传操作
        cos.putObject(
          {
            Bucket: 'gyb-01-1312382955' /* 填入您自己的存储桶，必须字段 */,
            Region: 'ap-nanjing' /* 存储桶所在地域，例如ap-beijing，必须字段 */,
            Key: params.file.name /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
            Body: params.file /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */,
            // onProgress: function (progressData) {
            //   console.log(JSON.stringify(progressData))
            // }
            onProgress: params => {
              console.log(params)
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            //data返回之后如何处理
            console.log(err || data) //data中有一个stateCode === 200 的时候说明上传成功
            if (!err && data.statusCode === 200) {
              //200说明上传成功
              //把data里的location赋值给fileList里对象的url，fileList是一个数组，所以不能fileList[0],
              this.fileList = this.fileList.map(item => {
                //这里的话是相当于将上传成功的地址，回写到了
                //这里是找谁的uid等于刚刚记录下来的id
                if (item.uid === this.currentFileUid) {
                  //将成功的地址赋值给原来的url属性
                  return { url: 'http://' + data.Location, upload: true }
                  //upload为true表示这张图片已经上传完毕，做标记，通过有没有upload这个标记来决定是否去保存，应该等upload图片上传成功才能点击保存更改按钮
                }
                return item //将上传成功的地址 回写到了fileList中，fileList变化 =》upload就会根据fileList的变化而去渲染视图
              })
              // 上传成功后 把进度条percent归零，并关闭进度条
              setTimeout(() => {
                this.showPercent = false
                this.percent = 0
              }, 1000)
            }
          }
        )
      }
    }
  }
}
</script>

<style>
.displayNone .el-upload--picture-card {
  display: none;
}
</style>