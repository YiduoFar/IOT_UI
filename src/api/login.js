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

// 登录接口
export const Login = data => {
  return request({
    url: '/user-info/login',
    method: 'post',
    data,
  })
}

// MOCK登录接口
export const LoginMOCK = data => {
  return request({
    url: '/login',
    method: 'post',
    data,
  })
}

// 注册接口
export const Reg = data => {
  return request({
    url: '/user-info/register',
    method: 'post',
    data,
  })
}

// 获取登录用户信息
export const GetUserinfo = () => {
  return request({
    url: '/userinfo',
    method: 'get',
  })
}
