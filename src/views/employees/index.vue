<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{page.total}}位员工</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
          >导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="exportData"
          >导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showDialog=true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table
          v-loading="loading"
          border
          :data="list"
        >
          <el-table-column
            label="序号"
            sortable=""
            type="index"
          />
          <el-table-column
            label="姓名"
            sortable=""
            prop="username"
          />
          <el-table-column
            label="工号"
            sortable=""
            prop="workNumber"
          />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column
            label="部门"
            sortable=""
            prop="departmentName"
          />
          <el-table-column
            label="入职时间"
            sortable=""
            prop="timeOfEntry"
          >
            <template v-slot="obj">
              {{obj.row.timeOfEntry|formatDate}}
            </template>
          </el-table-column>

          <el-table-column
            label="账户状态"
            sortable=""
            prop="enableState"
          >
            <template v-slot="obj">
              <el-switch :value="obj.row.enableState===1" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable=""
            fixed="right"
            width="280"
          >
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
              >转正</el-button>
              <el-button
                type="text"
                size="small"
              >调岗</el-button>
              <el-button
                type="text"
                size="small"
              >离职</el-button>
              <el-button
                type="text"
                size="small"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
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
          <el-pagination
            layout="prev, pager, next"
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- //sync修饰符：目的是当子组件想要改变父组件数据的一个语法糖时 ，只需写上sync这里就不需要再监听了,后面关闭就容易了-->
    <add-employee
      :showDialog="showDialog"
      @addEmployee="getEmployeeList"
      @closeEmployee="closeEmployee"
    ></add-employee>
  </div>
</template>
<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/addEmployee.vue'
import { formatDate } from '@/filters'
export default {
  components: { AddEmployee },
  data() {
    return {
      list: [], //接受数组
      page: {
        page: 1, //页码
        size: 10, //每页条数
        total: 0 //总数
      },
      loading: false, //显示遮罩层
      showDialog: false //默认是关闭图层
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage //赋值最新页码
      this.getEmployeeList() //重新拉取数据，更新页面
    },
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('确定删除该员工吗') //要想捕获到取消就必须使用try,catch
        await delEmployee(id)
        this.getEmployeeList() //重新拉取数据，更新页面
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    closeEmployee(boolean) {
      this.showDialog = boolean
    },
    exportData() {
      //导出excel，当点击的时候我们再加载这个文件
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // import('@/vendor/Export2Excel').then(excel => {
      //   //加载成功
      //   //excel是引入文件的导出对象
      //   // import引入我们要导入的这个包，.then后面的代码就是懒加载,.then之后（引入包成功之后执行then方法）拿到excel，excel就是包导出的内容，
      //   //内容里有excel.export_json_to_excel,这个方法当我们执行这个方法之前我们并没有下载vendor/Export2Excel，
      //   //只有当点击的时候才会引用这个js，也就是说当我们没有用这个功能时，我们不去引用依赖，点击按钮执行的时候再把文件引入执行，
      //   //引入成功之后才会去执行导出操作，这个就是安装依赖和按需加载
      //   excel.export_json_to_excel({
      //     header: ['姓名', '工资'], //表头 必填
      //     data: [['张三', '2500']],
      //     //具体数据 必填，需要注意的是这里不能是对象，只能是数组,我们发现数组里放的是数组，而不是对象，所以我们需要把现在的数据格式转换为这种格式
      //     filename: '员工工资表', //非必填
      //     autoWidth: true, //非必填，要导出文件的名字
      //     bookType: 'xlsx' //非必填，要导出的文件类型
      //   })
      //   //[{username:'张三',mobile:13123456987}]转换为数组里面套数组，涉及到数据结构的转化，我们数组date里面放的是key，value
      //   //所以我们不仅要转化为数据结构，还要和表头的顺序对应上
      //   //要求转出的标题是中文，但是现在的员工数据已经被转为了英文。所以又涉及到中英文转化
      // })
      import('@/vendor/Export2Excel').then(async excel => {
        //excel是引入文件的导出对象
        //导出 header可以直接从上面定义的headers数据中直接取出
        //data从哪里来，目前没有一个接口可以获取所有数据
        //我们获取员工的接口是通过页码和每页条数来获取的
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total }) //但这个依然不是我们想要的数据，数据结构不对
        const data = this.formatJson(headers, rows) //只传rows是不行的，还要和表头对应上
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']] //返回的data就是要导出的结构
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers), //表头 必填
          data: data,
          //具体数据 必填，需要注意的是这里不能是对象，只能是数组,我们发现数组里放的是数组，而不是对象，所以我们需要把现在的数据格式转换为这种格式
          filename: '员工工资表', //非必填
          multiHeader, //复杂表头
          merges, //合并
          autoWidth: true, //非必填，要导出文件的名字
          bookType: 'xlsx' //非必填，要导出的文件类型
        })
        //[{username:'张三',mobile:13123456987}]转换为数组里面套数组，涉及到数据结构的转化，我们数组date里面放的是key，value
        //所以我们不仅要转化为数据结构，还要和表头的顺序对应上
        //要求转出的标题是中文，但是现在的员工数据已经被转为了英文。所以又涉及到中英文转化
      })
    },
    formatJson(headers, rows) {
      //将表头数据和数据进行对应，返回的data就是要导出的结构
      //通过此方法来转化
      return rows.map(item => {
        //items是一个对象 {mobile:123,username:'张三'}
        return Object.keys(headers).map(key => {
          //这里return是因为上面也是一个map对象，给上面的map又返回一个数组
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            //注意这里的obj不能是item（和最上面的item重复了），局部变量和全局变量重复，用局部否则item会未定义undefined
            return obj ? obj.value : '未知'
          }
          //我们在导出的时候判断一下字段
          return item[headers[key]] //headers[key]得到的是一个英文名
        })
      })
    }
  }
}
</script>