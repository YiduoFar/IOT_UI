/*
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2021-04-21 09:36:55
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */
import request from '@/utils/request'

// import * as API from '@/api/equipment'

// 获取设备列表
export const getEquipmentList = data => {
  return request({
    url: '/device-info/list/' + data.productLineCode,
    method: 'get',
    params: data.params,
  })
}

// 获取设备
export const getEquipment = data => {
  return request({
    url: '/device-info/info/' + data,
    method: 'get',
  })
}

// 新增设备
export const addEquipment = data => {
  return request({
    url: '/device-info/save',
    method: 'post',
    data,
  })
}

// 修改设备
export const editEquipment = data => {
  return request({
    url: '/device-info/update',
    method: 'post',
    data,
  })
}

// 获取传感器列表
export const getSensorList = data => {
  return request({
    url: '/sensor-info/list/' + data.deviceCode,
    method: 'get',
    params: data.params,
  })
}

// 获取设备异常列表
export const getEquipmentErrorList = data => {
  return request({
    url: '/getEquipmentErrorList',
    method: 'get',
    params: data,
  })
}

// 上传设备大图
export const upload = data => {
  return request({
    url: '/device-info/upload',
    method: 'post',
    data,
  })
}

// 删除设备
export const deleteEquipment = data => {
  return request({
    url: '/device-info/delete',
    method: 'post',
    data,
  })
}

// 获取传感器
export const getSensor = data => {
  return request({
    url: '/sensor-info/info/' + data,
    method: 'get',
  })
}

// 新增传感器
export const addSensor = data => {
  return request({
    url: '/sensor-info/save',
    method: 'post',
    data,
  })
}

// 修改传感器
export const editSensor = data => {
  return request({
    url: '/sensor-info/update',
    method: 'post',
    data,
  })
}

// 删除传感器
export const deleteSensor = data => {
  return request({
    url: '/sensor-info/delete',
    method: 'post',
    data,
  })
}

// 获取设备数据
export const getEquipmentDataList = data => {
  return request({
    url: '/data-info/device/' + data.deviceCode,
    method: 'get',
    params: data.params,
  })
}

// 获取设备异常
export const getEquipmentError = data => {
  return request({
    url: '/abnormal-info/device/' + data.deviceCode,
    method: 'get',
    params: data.params,
  })
}

// 获取脱敏设备列表
export const getByDesensitizationAndProductLineCode = data => {
  return request({
    url: '/sensor-info/selectPageByDesensitizationAndProductLineCode',
    method: 'get',
    params: data,
  })
}
