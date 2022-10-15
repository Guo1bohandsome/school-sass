/**
 * 获取角色列表
 * ***/
import request from '@/utils/request'
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params,
  })
}
//获取企业信息
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`,
    method: 'GET',
  })
}
/** **
 *  删除角色
 *
 * ****/
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete',
  })
}
/**
 * 获取角色详情
 * **/
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
/** *
 * 修改角色
 * ***/
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data, //这里编辑修改还需要data参数
    method: 'put'
  })
}
/** *
 * 新增角色
 * ***/
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data,
  })
}