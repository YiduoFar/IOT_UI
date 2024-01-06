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
const List = () => import('@/views/production-line-manage/index.vue')

const ProductionLineTabs = () =>
  import('@/views/production-line-manage/tabs/ProductionLineTabs.vue')
const EquipmentTabs = () =>
  import('@/views/production-line-manage/tabs/EquipmentTabs.vue')

export default [
  {
    path: '/production-line-manage',
    component: Layout,
    name: 'productionLineManage',
    meta: {
      title: '产线管理',
      breadcrumb: '产线管理',
    },
    icon: 'icon-production-line-manage',
    children: [
      {
        path: '',
        // 此处理应是list，但为了点击面包屑不会跳转到不存在的首页（既/production-line-manage）所以首页=list
        // path: 'list',
        name: 'productionLineList',
        component: List,
        meta: {
          // 在这里注释掉可以不在面包屑显示
          title: '产线列表',
          breadcrumb: '产线列表',
        },
      },
      {
        path: 'details',
        name: 'ProductionLineTabs', // 注释掉name好像可以让页面不被缓存 试了一下没用
        component: ProductionLineTabs,
        meta: {
          title: '产线详情',
          // noCache: true, // 不缓存 也没用
          breadcrumb: '产线详情',
        },
        hidden: true,
      },
      {
        path: 'equipment',
        name: 'EquipmentTabs',
        component: EquipmentTabs,
        meta: {
          title: '设备详情',
          breadcrumb: '设备详情',
        },
        hidden: true,
      },
    ],
  },
]
