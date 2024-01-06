/*
 *
 * 　　┏┓　　　┏┓+ +
 * 　┏┛┻━━━┛┻┓ + +
 * 　┃　　　　　　　┃
 * 　┃　　　━　　　┃ ++ + + +
 *  ████━████ ┃+
 * 　┃　　　　　　　┃ +
 * 　┃　　　┻　　　┃
 * 　┃　　　　　　　┃ + +
 * 　┗━┓　　　┏━┛
 * 　　　┃　　　┃
 * 　　　┃　　　┃ + + + +
 * 　　　┃　　　┃
 * 　　　┃　　　┃ +  神兽保佑
 * 　　　┃　　　┃    代码无bug
 * 　　　┃　　　┃　　+
 * 　　　┃　 　　┗━━━┓ + +
 * 　　　┃ 　　　　　　　┣┓
 * 　　　┃ 　　　　　　　┏┛
 * 　　　┗┓┓┏━┳┓┏┛ + + + +
 * 　　　　┃┫┫　┃┫┫
 * 　　　　┗┻┛　┗┻┛+ + + +
 *
 *
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2021-07-26 13:06:50
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */

export default [
    {
        url: '/api/getInspectionList',
        method: 'get',
        timeout: 1000,
        response: {
            code: 200,
            message: '获取巡检列表成功',
            'data|10': [
                {
                    'id|+1' : 1,
                    'productionLineName|1' : ['产线A', '产线B', '产线C'],
                    'productPinMu|1': ['车门','轮胎','座椅'],
                    'productPinFan|1': ['asfasdas', 'asdfxcv2','xcvjxizf'],
                    'inspectionInitiator|1': ['张三', '李四'],
                    'inspectionStartTime': '@datetime()',
                    'inspectionEndTime': '@datetime()',
                    'handleStatus|1' : [0, 1, 2],
                }
            ],
            'total|100-999': 1
        },
    },
]
