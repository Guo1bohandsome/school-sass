<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog=true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table
              :data="list"
              border=""
            >
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="120"
              />
              <el-table-column
                prop="name"
                label="角色名称"
                width="240"
              />
              <el-table-column
                align="center"
                prop="description"
                label="描述"
              />
              <el-table-column label="操作">
                <template slot-scope="{row}">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
              <!-- current-page当前page -->
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form
              label-width="120px"
              style="margin-top:50px"
            >
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  placeholder="欢迎加入本公司"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog
      title="编辑弹层"
      :visible="showDialog"
      @close="btnCancel"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          label="角色名称"
          prop="name"
        >
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row
        slot="footer"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            size="small"
            @click="btnCancel"
          >取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="btnOK"
          >确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >

      <el-row>
        <!-- 把id作为唯一标识 -->
        <el-tree
          ref="permTree"
          :data="permData"
          :props="defaultProps"
          :default-expand-all="true"
          :show-checkbox="true"
          :check-strictly="true"
          :default-checked-keys="selectCheck"
          node-key="id"
        ></el-tree>

      </el-row>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            type="primary"
            size="small"
            @click="btnPermOK()"
          >确定</el-button>
          <el-button
            size="small"
            @click="btnPermCancel()"
          >取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting.js'
import { getPermissionList, delPermission, addPermission, updatePermission, getPermissionDetail } from '@/api/permission.js'
import { mapGetters } from 'vuex' //引用辅助函数
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [], //承接数组
      page: {
        //
        page: 1, //当前默认页码
        pagesize: 3, //每页条数
        total: 0 //记录总数
      },
      permData: [], //接收权限数据
      formData: {
        //用来接收公司信息
      },
      defaultProps: {
        label: 'name'
      }, //定义显示字段的名称和子属性的字段名称
      roleId: null, //用来记录当前分配权限的id
      selectCheck: [], //用来记录当前的权限点的标识
      showDialog: false, //控制弹层显示
      showPermDialog: false, //控制分配权限弹层的显示或者隐藏
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: { ...mapGetters(['companyId']) },
  //引入vuex的参数放在计算属性上
  created() {
    this.getRoleList() //获取角色列表
    this.getCompanyInfo() //获取公司数据
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      console.log(rows)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    changePage(newPage) {
      //newPage时当前点击的页码
      this.page.page = newPage //将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    async deleteRole(id) {
      //  提示
      try {
        await this.$confirm('确认删除该角色吗') //通过.then来等待成功，既然用来.then，
        //说明也可以用async，await。如果不加try，catch，控制台会报cancel错误。
        //如果想捕获cancel错误，因为成功进then，失败进catch，如果把她改成async和啊await
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) //实现数据回显1
      this.showDialog = true //显示弹层
    },
    async btnOK() {
      // this.$refs.roleForm.validate(isOK=>{});这个写法在员工架构模块已经写过，这里我们
      //换另一种写法，如果我们不写isOk这个参数，会返回一个promise对象，可以.then,.catch,
      //也可以async，await
      //只有校验通过的情况下才会执行await的下方内容
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          //roleForm这个对象有id就是编辑 没有id就是新增
          await updateRole(this.roleForm)
        } else {
          await addRole(this.roleForm) //新增业务
        }
        this.getRoleList() //重新拉取数据，进行前端界面更新
        this.showDialog = false //这里关闭弹层的时候自动触发el-dialog的close事件，
        //只需要close事件在绑定的btnCancel方法清空数据即可，说明点击确定时触发❌close事件，
        //简介调用了btnCancel方法进行清空数据
      } catch (error) {
        console.log(err)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      //移除校验规则
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    //弹出层
    async assignPerm(id) {
      //获取所有权限点,并转化list到树型数据
      this.roleId = id
      //把id记录下来，有id就可以先记录下来,如果不记录下来，点击确定的时候，不知道往哪个id里去存
      //
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      const { permIds } = await getRoleDetail(id) //permIds是当前角色所拥有的权限点数据
      console.log(permIds) //打印的是权限点的id
      this.selectCheck = permIds //将当前角色所拥有的权限id赋给默认的selectCheck
      this.showPermDialog = true
    },
    async btnPermOK() {
      //调用el-tree的方法

      await assignPerm({ id: this.roleId, permIds: this.$refs.permTree.getCheckedKeys() })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
      //注意到这一步后，我们默认的selectCheck并没有清掉，一直在组件里,所以里面的权限点不会被改变
    },
    btnPermCancel() {
      this.selectCheck = []
      this.showPermDialog = false
    }
  }
}
</script>