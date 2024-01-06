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

// 更新设置
export const updateConfig = data => {
  return request({
    url: '/config-info/update',
    method: 'post',
    data,
  })
}

// 获取设置
export const getConfig = data => {
  return request({
    url: '/config-info/info/' + data,
    method: 'get',
  })
}
