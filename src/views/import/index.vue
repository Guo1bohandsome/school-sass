<template>
  <upload-excel :on-success="success"></upload-excel>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: 'importEmployee',
  methods: {
    async success({ header, results }) {
      //result是数组
      // 如果是导入员工
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        聘用形式: 'formOfEmployment',
        组织名称: 'departmentName'
      }

      var newArr = results.map(item => {
        console.log(item)
        console.log(Object.keys(item)) //以为是item的keys，所以打印出来的是

        var userInfo = {}
        Object.keys(item).forEach(key => {
          //key是当前中文名，找到对应英文名
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            //后端接口限制不能是字符串
            userInfo[userRelations[key]] = new Date(this.formDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key]
          }
        })
        return userInfo
      })
      await importEmployee(newArr), //接受一个数组
        this.$message.success('导入excel成功'),
        this.$router.back() //回到上一个页面
    },
    formDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>
</style>