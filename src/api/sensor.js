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

// 获取传感器接口
export const getSensor = data => {
  return request({
    url: '/sensor-info/info/' + data,
    method: 'get',
  })
}

// 获取传感器数据接口
export const getSensorDataInfo = data => {
  return request({
    url: '/data-info/sensor/' + data.sensorCode,
    method: 'get',
    params: data.params,
  })
}
