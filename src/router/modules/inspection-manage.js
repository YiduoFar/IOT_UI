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
const List = () => import('@/views/inspection-manage/index.vue')

export default [
  {
    path: '/inspection-manage',
    component: Layout,
    name: 'inspectionManage',
    meta: {
      title: '巡检管理',
      breadcrumb: '巡检管理',
    },
    icon: 'MessageBox',
    // icon: 'icon-inspection-manage',
    children: [
      {
        path: '',
        // name: 'inspectionList',
        component: List,
        meta: {
          title: '巡检管理列表',
          breadcrumb: '巡检管理列表',
          // noCache: true
        },
      },
    ],
  },
]
