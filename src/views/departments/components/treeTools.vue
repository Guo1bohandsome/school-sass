<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row
        type="flex"
        justify="end"
      >
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="operateDepts">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="add"
                :disabled="!checkPermission('add-dept')"
              >添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { delDepartment } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object, //对象类型
      required: true //要求对方使用组件的时候，必须传递treeNode属性，否则会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    //点击、编辑、删除、新增时触发
    operateDepts(type) {
      if (type === 'add') {
        this.$emit('addDepts', this.treeNode)
        //添加子部门
      } else if (type === 'edit') {
        this.$emit('editDepts', this.treeNode)
        //编辑部门
      } else {
        //删除部门
        alert('删除')
        this.$confirm('是否删除该部门')
          .then(() => {
            return delDepartment(this.treeNode.id)
          })
          .then(() => {
            this.$emit('delDepts') //触发自定义事件
            this.$message.success('删除部门成功')
          })
      }
    }
  }
}
</script>