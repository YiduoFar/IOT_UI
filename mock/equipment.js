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
        url: '/api/getEquipmentList',
        method: 'get',
        timeout: 1000,
        response: {
            code: 200,
            message: '获取设备列表成功',
            'data|10': [
                {
                    'id|+1': 1,
                    'equipmentName|1': ['设备A', '设备B', '设备C'],
                    'equipmentStatus|1': [0, 1, 2],
                    'sensorTotal|1-10': 1,
                    'equipmentDetails|1': ['这是一台注塑机', '这是一台冲压机'],
                }
            ],
            'total|100-999': 1
        },
    },
    {
        url: '/api/getSensorList',
        method: 'get',
        timeout: 1000,
        response: {
            code: 200,
            message: '获取传感器列表成功',
            'data|10': [
                {
                    'id|+1': 1,
                    'sensorName|1': ['温度传感器', '电流传感器', '电压传感器'],
                    'sensorStatus|1': [0, 1, 2],
                    'attributeName|1': ['温度', '电流', '电压'],
                    'attributeId': 'text.deviceA.temperature',
                    'dataType': 'float',
                    'scanningRate|1': ['500ms', '1000ms'], // 实际后端并不以字符串传递
                    'alarmRule|1': [{
                        type: 'mA',
                        begin: '1',
                        end: '4',
                    }, {
                        type: 'mV',
                        begin: '1',
                        end: '4',
                    }, {
                        type: '℃',
                        begin: '20.0',
                        end: '40.0',
                    }],
                    'switch|1': [true, false]
                }
            ],
            'total|100-999': 1
        },
    },
    {
        url: '/api/getEquipmentDataList',
        method: 'get',
        timeout: 1000,
        response: {
            code: 200,
            message: '获取设备数据列表成功',
            'data|10': [
                {
                    'id|+1': 1,
                    'sensorName|1': ['温度传感器', '电流传感器', '电压传感器'],
                    'sensorCode|1': ['djasfdsin2', 'sxilsf1', 'ayyjklsi2'],
                    'samplingTime': '@datetime()',
                    'samplingValue|1': [{
                        type: 'mA',
                        value: '6'
                    }, {
                        type: 'mV',
                        value: '3'
                    }, {
                        type: '℃',
                        value: '8'
                    },],
                }
            ],
            'total|100-999': 1
        },
    },
    {
        url: '/api/getEquipmentErrorList',
        method: 'get',
        timeout: 1000,
        response: {
            code: 200,
            message: '获取设备异常列表成功',
            'data|10': [
                {
                    'id|+1': 1,
                    'supplierName': '广州樱泰汽车饰件有限公司',
                    'productionLineName|1': ['产线A', '产线C', '产线C'],
                    'equipmentName|1': ['注塑机', '冲压机'],
                    'equipmentCode|1': ['DSDPFMX1', 'SDFSDWF2'],
                    'sensorName|1': ['温度传感器', '电流传感器', '电压传感器'],
                    'sensorCode|1': ['sdfassf1', 'xcxerwer2', 'dfewfsfd3'],
                    'errorTime': '@datetime()',
                }
            ],
            'total|100-999': 1
        },
    },
]
