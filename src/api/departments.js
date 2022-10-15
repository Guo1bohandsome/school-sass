import request from '@/utils/request'
//获取组织架构的数据
export function getDepartments() {
  return request({
    url: '/company/department',
    method: 'GET',
  })
}
export function delDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`,
  })
}
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}