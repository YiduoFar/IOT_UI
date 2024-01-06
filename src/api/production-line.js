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

// import * as API from '@/api/production-line'

// 获取产线列表接口
export const getProductionLineList = data => {
  return request({
    url: '/product-line-info/list/' + data.supplierCode,
    method: 'get',
    params: data.params,
  })
}

// 获取产线详情
export const getProductionLineDetails = data => {
  return request({
    url: '/product-line-info/info/' + data,
    method: 'get',
  })
}

// 新增产线
export const addProductionLine = data => {
  return request({
    url: '/product-line-info/add',
    method: 'post',
    data,
  })
}

// 修改产线
export const editProductionLine = data => {
  return request({
    url: '/product-line-info/update',
    method: 'post',
    data,
  })
}

// 批量删除产线
export const deleteProductionLine = data => {
  return request({
    url: '/product-line-info/delete',
    method: 'post',
    data,
  })
}

// 上传产线图片
export const upload = data => {
  return request({
    url: '/product-line-info/upload',
    method: 'post',
    data,
  })
}
