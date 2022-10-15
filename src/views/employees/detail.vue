<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form
              ref="userForm"
              :rules="rules"
              :model="userInfo"
              label-width="120px"
              style="margin-left: 120px; margin-top:30px"
            >
              <el-form-item
                label="姓名:"
                prop="username"
              >
                <el-input
                  v-model="userInfo.username"
                  style="width:300px"
                />
              </el-form-item>
              <el-form-item
                label="密码:"
                prop="password2"
              >
                <el-input
                  v-model="userInfo.password2"
                  style="width:300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="saveUser"
                >更新</el-button>
                <el-button @click="$router.back()">返回</el-button>

              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-button
              type="primary"
              @click="UserComponent='el-button'"
            >切换组件</el-button>
            <el-button
              type="primary"
              @click="UserComponent='UserInfo'"
            >切换组件2</el-button>
            <!-- <UserInfo/> -->
            <!-- 在这里我们换一种写法 -->
            <component :is="UserComponent" />
            <!-- 在vue.js中内置了一个组件component,可以是任何组件 -->
            <!-- 我们使用了动态组件component,它通过is属性来绑定需要显示在该位置的组件，is属性直接为注册组件的组件名 -->
            <!-- 反而变得麻烦了，所以这个到底有啥作用呢？因为动态组件可以切换组件，把UserComponent 的值改为任何值，@click="UserComponent='el-button'" -->
            <!-- 原来的写法组件只能写死，只能显示固定的组件。注意is后面必须跟变量 -->
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="JonComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>

</template>

<script>
import { getUserDetailById } from '@/api/user' //嗲用这个接口需要id
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
  components: { UserInfo, JobInfo },
  data() {
    return {
      UserComponent: 'UserInfo',
      JonComponent: 'job-info',
      userId: this.$route.params.id,
      //①这样可以后面直接通过this.userId进行获取数据,这里是直接取到了url的路由参数了，来源于路由中的参数,直接将路由中的参数赋值给了data中的属性
      //②这里是params而不是querry是因为之前在路由里写的是path：'detail/:id'而不是path：'detail/id？id=123'
      userInfo: {
        username: '',
        password2: '' //为什么叫password2 因为读取出来的password是密文，会校验失败
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId) //这里我们通过接口获得的密码是一个密文
    },
    saveUser() {
      //调用方法时，应该校验
      this.$refs.userForm.validate().then(async () => {
        await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        //①注意这里后端只认password但是我们是password2，我们需要把password2给password
        //②我们这里把userindo浅拷贝一份,js默认对象中同样的变量名，后面的变量替换前面的变量
        this.$message.success('修改用户信息成功')
      })
    }
  }
}
</script>

<style>
</style>