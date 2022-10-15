<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <treeTools
          :tree-node="company"
          :is-root="true"
          @addDepts="addDepts"
        ></treeTools>
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <!-- <el-row
            slot-scope="{ data }"
            type="flex"
            justify="space-between"
            align="middle"
            style="height: 40px; width: 100%"
          >
            <el-col>
              //左侧内容
              <span>{{ data.name }}</span>
            </el-col>
            <el-col :span="4">
              <el-row
                type="flex"
                justify="end"
              >
                <el-col>{{ data.manager }}</el-col>
                <el-col>
                 // 放置下拉菜单
                  <el-dropdown>
                    //内容
                    <span>操作
                      <i class="el-icon-arrow-down" />
                    </span>
                    //具名插槽
                    <el-dropdown-menu slot="dropdown">
                      //下拉选项
                      <el-dropdown-item>添加子部门</el-dropdown-item>
                      <el-dropdown-item>编辑部门</el-dropdown-item>
                      <el-dropdown-item>删除部门</el-dropdown-item>

                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>

              //右侧内容
            </el-col>
          </el-row> -->
          <tree-tools
            slot-scope="{data}"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <addDept
      ref="addDept"
      :showDialog="showDialog"
      :treeNode="node"
      @addDepts="getDepartments"
      @closeDialog="closeDialog"
      @cancelDialog="cancelDialog"
    ></addDept>
  </div>
</template>

<script>
import TreeTools from './components/treeTools.vue'
import addDept from './components/addDept.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index.js'
export default {
  components: {
    TreeTools,
    addDept
  },
  data() {
    return {
      company: {},
      departs: [],
      showDialog: false,
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      node: null //记录当前点击的node节点
    }
  },
  created() {
    this.getDepartments() //调用自身方法
    // this.addDepts()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '')
      console.log(result)
    },
    addDepts(node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      console.log(this.$refs.addDept)
      this.$refs.addDept.getDepartDetail(node.id) //直接调用子组件中的方法，并传入id
    },
    closeDialog(value) {
      this.showDialog = value
    },
    cancelDialog(value) {
      this.showDialog = value
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>