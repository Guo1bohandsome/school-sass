<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 表单 -->
    <el-form
      ref="addEmployee"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        label="姓名"
        prop="username"
      >
        <el-input
          style="width:50%"
          placeholder="请输入姓名"
          v-model="formData.username"
        />
      </el-form-item>
      <el-form-item
        label="手机"
        prop="mobile"
      >
        <el-input
          style="width:50%"
          placeholder="请输入手机号"
          v-model="formData.mobile"
        />
      </el-form-item>
      <el-form-item
        label="入职时间"
        prop=" timeOfEntry"
      >
        <el-date-picker
          style="width:50%"
          placeholder="请选择入职时间"
          v-model="formData.timeOfEntry"
        />
      </el-form-item>
      <el-form-item
        label="聘用形式"
        prop="formOfEmployment"
      >
        <el-select
          style="width:50%"
          placeholder="请选择"
          v-model="formData.formOfEmployment"
        >
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="工号"
        prop="workNumber"
      >
        <el-input
          style="width:50%"
          placeholder="请输入工号"
          v-model="formData.workNumber"
        />
      </el-form-item>
      <el-form-item
        label="部门"
        prop="departmentName"
      >
        <el-input
          style="width:50%"
          placeholder="请选择部门"
          v-model="formData.departmentName"
          @focus="getDepartments"
        />
        <el-tree
          v-loading="loading"
          v-if="showTree"
          :data="treeData"
          :props="{label:'name'}"
          :default-expand-all="true"
          @node-click="selectNode"
        ></el-tree>
      </el-form-item>
      <el-form-item
        label="转正时间"
        prop="correctionTime"
      >
        <el-date-picker
          style="width:50%"
          placeholder="请选择转正时间"
          v-model="formData.correctionTime"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            size="small"
            @click="btnCancel"
          >取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="btnOK"
          >确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>
<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees' //引入表单
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum, //定义表单名
      formData: {
        //这个formData要和新增接口获得的数据是一对一，因为存的就是这些数据
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          },
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'change'
          }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }]
      },
      treeData: [], //定义一个数组来接收树形结构
      showTree: false, //默认不显示树形组件
      loading: false //加上进度条
    }
  },
  methods: {
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      //我们从中解构出来的数据只是一个数组，需要转化成树形结构，才可以被el-tree显示
      console.log(depts)
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      console.log(node)
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async btnOK() {
      try {
        await this.$refs.addEmployee.validate() //我们想只要他校验成功才能往下执行
        await addEmployee(this.formData) //调用新增接口
        // this.$emit('addEmployee')//我们这里换一种写法，不采用子传父的写法
        // console.log(this.$parent)//得到一个父组件实例vueComponent,这里面的属性就是父组件的属性
        this.$parent.getEmployeeList
        //直接调用父组件的更新方法，如果要严谨一些首先要判断父组件是否有getEmployeeList方法
        this.$parent.showDialog = false
        //这里不用写重置，因为关闭弹层触发了close事件，而close事件绑定了btncancel方法
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.formData = {
        //这个formData要和新增接口获得的数据是一对一，因为存的就是这些数据
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields() //移除之前的校验
      this.$emit('closeEmployee', false)
    }
  }
}
</script>

<style>
</style>

