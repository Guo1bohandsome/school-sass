<template>
  <el-dialog
    title="分配角色"
    :visible="showRoleDialog"
    @close="close()"
  >
    <el-row>
      <el-checkbox-group v-model="roleIds">
        <!-- v-model是默认显示的值 -->
        <el-checkbox
          v-for="item in list"
          :key="item.id"
          :label="item.id"
        >{{item.name}}</el-checkbox>
      </el-checkbox-group>
    </el-row>
    <el-row
      type="flex"
      justify="center"
    >
      <el-col :span="6">
        <el-button
          type="primary"
          size="samll"
          @click="btnOK"
        >确定</el-button>
        <el-button
          size="samll"
          @click="btnCancel"
        >取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      //用户的id，指当前要处理哪个用户
      type: String,
      default: null
      //   required: true //要求必须传该id
    }
  },
  data() {
    return {
      list: [], //负责存储当前所有的角色的id
      roleIds: [] //这个数组负责存储  当前用户所拥有的角色id
    }
  },
  created() {
    //获取所有角色
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 }) //不传参数值，默认只取10条数据是角色数量，详见公司设置
      this.list = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id) //将用户所拥有的角色赋值给当前用户的对象
      //此时不能用this.userId，因为这个方法，是点击父组件的显示时，立马显示。而父组件给子组件传值并渲染是一个异步操作。所以这里不能用this.userId。
      //因为我们这个方法是给父组件调的
      //父组件调用子组件的方法可以用refs
      this.roleIds = roleIds
    },
    close() {
      this.$parent.showRoleDialog = false
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      //   this.$emit('closeRole', false)
      this.$parent.showRoleDialog = false
    },
    btnCancel() {
      this.$parent.showRoleDialog = false
    }
  }
}
</script>

<style>
</style>