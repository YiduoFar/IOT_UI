/*
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-24 19:27:21
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */
// home.js
const Layout = () => import('@/layout/index.vue')
const List = () => import('@/views/configuration/index.vue')

export default [
  {
    path: '/configuration',
    component: Layout,
    name: 'configuration',
    meta: {
      title: '相关配置',
      breadcrumb: '相关配置',
    },
    icon: 'icon-setting',
    children: [
      {
        path: '',
        name: 'configurationPanel',
        component: List,
        meta: {
          // title: '配置',
          // breadcrumb: '配置',
        },
      },
    ],
  },
]
