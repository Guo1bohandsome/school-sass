<template>
  <!-- 新增部门的弹层 -->
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      label-width="120px"
      :model="formData"
      :rules="rules"
      ref="deptForm"
    >
      <el-form-item
        label="部门名称"
        prop="name"
      >
        <el-input
          style="width:80%"
          placeholder="1-50个字符"
          v-model="formData.name"
        />
      </el-form-item>
      <el-form-item
        label="部门编码"
        prop="code"
      >
        <el-input
          style="width:80%"
          placeholder="1-50个字符"
          v-model="formData.code"
        />
      </el-form-item>
      <el-form-item
        label="部门负责人"
        prop="manager"
      >
        <el-select
          style="width:80%"
          placeholder="请选择"
          v-model="formData.manager"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="部门介绍"
        prop="introduce"
      >
        <el-input
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row
      slot="footer"
      type="flex"
      justify="center"
    >
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="btnOK"
        >确定</el-button>
        <el-button
          size="small"
          @click="btnCancel"
        >取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees.js'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    //检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      //value是部门名称，要去和同级部门下的部门去比较 有没有相同的，有则不通过，这里我们调用接口
      const { depts } = await getDepartments()
      console.log(depts)
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.formData.pid).some(item => item.name === value)
      } else {
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name == value)
        //如果isRepeat为true，表示找到了一样的名字
        console.log(isRepeat)
      }

      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}`)) : callback()
    } // 检查编码重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        //编辑模式下
        //需求是一样的 ，但要把自己给排除,再跟别人比
        isRepeat = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      peoples: [],
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkNameRepeat } //自定义校验规则
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat } //自定义校验规则
        ],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-300个字符' }
        ]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      //因为我们是父组件调用子组件的方法，先设置了node数据
      //但props传值是异步的，我们调用这个方法的时候，可能prop值还没过来，娶不到this.treeNode.id
    },
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            // 表示可以提交了
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
          }
          this.$emit('addDepts') //让页面进行更新
          this.$emit('closeDialog', false)
        }
      })
    },
    btnCancel() {
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('cancelDialog', false)
      this.$refs.deptForm.resetFields() // 重置校验字段
    }
  }
}
</script>

<style>
</style>