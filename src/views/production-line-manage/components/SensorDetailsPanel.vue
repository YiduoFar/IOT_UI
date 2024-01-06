<template>
  <!-- 传感器详情 -->
  <el-dialog
    v-model="dialogFormVisible"
    title="传感器采集数据"
    @close="close"
    width="1150px"
    top="13vh"
    draggable
    @open="open"
  >
    <!-- 数据面板 -->
    <div class="data-panel-box">
      <!-- 折线图 -->
      <div class="data-panel" id="dataPanel"></div>
      <!-- 数据列表 -->
      <div class="data-list">
        <!-- 骨架屏 -->
        <!-- <el-skeleton :rows="13" animated v-if="dataArr.length == 0" /> -->
        <!-- 数据列表头 -->
        <!-- <div class="data-list-header " v-if="dataArr.length != 0"> -->
        <div class="data-list-header ">
          <div class="header-time-text ">时间</div>
          <div class="header-value-text ">采样值</div>
        </div>
        <!-- 数据列表 -->
        <!-- <el-scrollbar> -->
        <!-- <div class="data-list-body" v-if="dataArr.length != 0"> -->
        <el-empty
          description="数据为空"
          :image-size="100"
          v-if="dataArr.length == 0"
          style="margin-top: 100px;position: absolute;left: 130px;"
        />
        <div class="data-list-body">
          <template v-for="(item, index) in dataArr" :key="index">
            <div
              class="list-item transition-250ms"
              :class="{ 'list-item_active': index == chooseIndex }"
            >
              <div class="item-time-box">
                {{ item.time }}
              </div>
              <div class="item-value-box" :title="item.value">
                {{ item.value }}
              </div>
            </div>
          </template>
        </div>
        <!-- </el-scrollbar> -->
      </div>
    </div>
    <!-- 时间范围选择 -->
    <el-select
      size="small"
      v-model="rangeValue"
      class="m-2 data-range"
      :class="{ 'choose-this': chooseMode == 0 }"
      placeholder="Select"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <!-- 日期时间范围选择器 -->
    <div class="date-picker " :class="{ 'choose-this': chooseMode == 1 }">
      <!-- 范围 &nbsp;&nbsp;&nbsp; -->
      <!-- <div :class="{ 'choose-this': chooseMode == 1 }"> -->
      <el-date-picker
        size="small"
        class="picker"
        v-model="rangeValue2"
        type="datetimerange"
        start-placeholder="选择开始时间"
        end-placeholder="选择结束时间"
        :default-time="defaultTime2"
      />
      <!-- </div> -->
    </div>
    <!-- 按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  reactive,
  watch,
  toRefs,
  ref,
  getCurrentInstance,
  onMounted,
} from 'vue'
import * as API from '@/api/sensor.js'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { useApp } from '@/pinia/modules/app'
import useStore from '@/pinia/modules/store'
import Worker from '@/utils/worker?worker'
import IntervalTimer from '@/utils/IntervalTimer1000ms?worker'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const { proxy } = getCurrentInstance()
    const Store = useStore()
    const { authorization } = useApp()
    let IntervalTimer1000ms = null
    const reset = () => {
      // 销毁Worker定时器
      IntervalTimer1000ms.terminate()
      state.isCloseTimer = true
      // 重置
      state.chooseIndex = null
      state.rangeValue = 60
      state.rangeValue2 = null
      state.chooseMode = -1
      // 关闭
      ctx.emit('update:visible', false)
    }
    const state = reactive({
      dialogFormVisible: ref(false),
      // 数据列表数组
      dataArr: ref([]),
      // 选中的数据下标
      chooseIndex: ref(),
      // 初始值时间范围（1分钟）
      rangeValue: ref(60),
      // rv: state.rangeValue,
      // 时间段初始值
      rangeValue2: ref(''),
      // rv2: state.rangeValue2,
      // 时间范围的选择模式
      chooseMode: ref(-1),
      // 时间段初始值
      defaultTime2: [
        new Date(2000, 1, 1, 12, 0, 0),
        new Date(2000, 2, 1, 8, 0, 0),
      ],
      range: ref(0),
      timer: null,
      isCloseTimer: false,
      timer2: null,
      // worker2: null,
      isChooseTimeRange: false,
      // 时间范围下拉框选择数组
      options: [
        {
          label: '1分钟',
          value: 60,
        },
        {
          label: '10分钟',
          value: 600,
        },
        {
          label: '1小时',
          value: 3600,
        },
        {
          label: '24小时',
          value: 86400,
        },
        {
          label: '近3天',
          value: 259200,
        },
        {
          label: '近30天',
          value: 2592000,
        },
      ],
      confirm: () => {
        reset()
      },
      open: () => {
        state.isCloseTimer = false
        state.initDataPanel()
      },
      close: () => {
        reset()
      },
      /**
       * 渲染画布
       * @param {*} val
       * @param {*} val2
       */
      initDataPanel: async (val, val2) => {
        var title = '传感器编码: ' + Store.sensor.code
        // 初始化画布
        var chartDom = document.getElementById('dataPanel')
        var myChart = echarts.init(chartDom)
        // x、y轴数据数组
        var xArrayData = [] // X轴时间
        var yArrayData = [] // Y轴采样值
        // 右侧数据列表数组
        state.dataArr = [] // 清空数据列表
        // 开始loading动画
        myChart.showLoading()
        // 先加载画布样式，数据为空
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true,
              },
            },
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
            },
          },
          calculable: true,
          legend: {
            data: ['Growth', title],
            itemGap: 5, // 标题之间的间距
          },
          grid: {
            top: '12%',
            left: '3%',
            right: '5%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: [0], // X轴 时间
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: '采样值',
              axisLabel: {
                formatter: function(a) {
                  a = +a
                  // 1可调节
                  return isFinite(a) ? echarts.format.addCommas(+a / 1) : ''
                },
              },
            },
          ],
          dataZoom: [
            {
              // x轴范围条显示
              show: false,
              // x初始范围
              start: 0,
              end: 100,
            },
            {
              type: 'inside',
              start: 94,
              end: 100,
            },
            {
              // y轴范围条显示
              show: false,
              yAxisIndex: 0,
              filterMode: 'empty',
              width: 30,
              height: '80%',
              showDataShadow: false,
              left: '93%',
            },
          ],
          series: [
            {
              name: title,
              // type line折线 bar柱状
              type: 'line',
              // Y轴 采样值
              data: [0],
              // 点不可见
              showSymbol: false,
              // 折线图另一种样式
              step: 'middle',
            },
          ],
        })

        /**
         * 1、加载首次数据到画布
         */
        // 开始、结束时间计算
        let et = proxy.$moment().format('YYYY-MM-DD HH:mm:ss')
        let st = proxy
          .$moment(et)
          .subtract(state.rangeValue, 'seconds')
          .format('YYYY-MM-DD HH:mm:ss')
        if (val) {
          if (val2) {
            st = proxy.$moment(val2[0]).format('YYYY-MM-DD HH:mm:ss')
            et = proxy.$moment(val2[1]).format('YYYY-MM-DD HH:mm:ss')
          } else {
            et = proxy.$moment().format('YYYY-MM-DD HH:mm:ss')
            st = proxy
              .$moment(et)
              .subtract(val, 'seconds')
              .format('YYYY-MM-DD HH:mm:ss')
          }
        }
        // 由于有日期时间选择器，需要这样获取时间范围间隔
        state.range = proxy.$moment(et).diff(st, 'seconds')
        // 根据开始、结束时间 获取首次数据
        const { code, data, message } = await API.getSensorDataInfo({
          params: {
            startTime: st,
            endTime: et,
          },
          sensorCode: Store.sensor.code,
        })
        // 记录最后的节点，用于之后心跳
        let oldNode = data.length != 0 ? data[data.length - 1] : null

        // 首次构建画布 (选择的一个时间间隔里无断线)，（有断线做不了，因为当前不能获取过去的异常状态）
        if (typeof Worker !== 'undefined') {
          // 首次构建数据由子线程完成
          const worker = new Worker()
          // 向子线程传递参数
          worker.postMessage(
            JSON.stringify({
              data: data,
              range: state.range,
              st: st,
            })
          )
          // 监听子线程发来的结果
          worker.onmessage = e => {
            // 将结果赋值到数组
            xArrayData = e.data[0]
            yArrayData = e.data[1]
            state.dataArr = e.data[2]
            // 首次更新数据到画布
            myChart.setOption({
              xAxis: [
                {
                  data: e.data[0],
                },
              ],
              series: [
                {
                  data: e.data[1],
                },
              ],
            })
            // 销毁第一个子线程
            worker.terminate()
          }
        } else {
          // 不支持Web Worker
          console.log('不支持Web Worker')
        }

        /**
         * 2、心跳（交给子线程获取数据，返回到主线程渲染）
         */
        if (!state.isCloseTimer) {
          let count = 0
          // 先获取token
          var token = null
          if (authorization) {
            token = `Bearer ${authorization.token}`
          }
          if (typeof Worker !== 'undefined') {
            // 每秒一次获取数据交给webWorker
            IntervalTimer1000ms = new IntervalTimer()
            // 向子线程传递参数
            IntervalTimer1000ms.postMessage(
              JSON.stringify({
                token: token,
                st: st,
                et: et,
                code: Store.sensor.code,
              })
            )
            // 监听子线程发来的结果
            IntervalTimer1000ms.onmessage = async e => {
              const data = e.data.data
              // 有数据时心跳，检测到传感器状态异常时线断开
              if (data && data.length != 0) {
                // 此获取新数据的方法的前提是同一时刻不会更新多条数据
                let isUpdate = false
                let newNode = data[data.length - 1]
                // 如果获取到的数组最后一个元素的时间比记录元素的时间晚，认定为数据已经更新
                if (
                  !oldNode ||
                  proxy.$moment(oldNode.timestamp).isBefore(newNode.timestamp)
                ) {
                  // if (newNode.timestamp != oldNode.timestamp) {
                  // 记录新数组的最后一个元素
                  oldNode = newNode
                  // 标记
                  isUpdate = true
                }
                // 操作画布，更新数据
                if (isUpdate) {
                  var timestamp = proxy
                    .$moment(newNode.timestamp)
                    .format('YYYY-MM-DD HH:mm:ss')
                  // 删除画布上折线图的第一个节点
                  xArrayData.shift()
                  yArrayData.shift()
                  // 加入新的节点
                  xArrayData.push(timestamp)
                  yArrayData.push(newNode.value)
                  // 更新右侧列表
                  state.dataArr.unshift({
                    time: timestamp,
                    value: newNode.value,
                  })
                }
                //根据传感器状态 判断是否添加断点
                // const sensor = await API.getSensor(Store.sensor.id)
                // if (sensor.data && sensor.data.sensorStatus === -1) {
                //   console.log('传感器信息：', sensor.data)
                //   xArrayData.shift()
                //   yArrayData.shift()
                //   xArrayData.push(proxy.$moment().format('YYYY-MM-DD HH:mm:ss'))
                //   if (count >= state.range) {
                //     yArrayData.push(0)
                //     count = 0
                //   } else {
                //     yArrayData.push('-')
                //     count++
                //   }
                // }
                // 数据更新到画布
                myChart.setOption({
                  xAxis: [
                    {
                      data: xArrayData,
                    },
                  ],
                  series: [
                    {
                      data: yArrayData,
                    },
                  ],
                })
              }
            }
          } else {
            // 不支持Web Worker
            console.log('不支持Web Worker')
          }

          // 监听画布的鼠标悬停事件
          myChart.on('mouseover', function(e) {
            // 高亮右侧列表中对应鼠标悬停在折线图上坐标点的数据
            state.chooseIndex = yArrayData.length - e.dataIndex - 1
            // 滚动标准距离 56
            document
              .getElementsByClassName('data-list-body')[0]
              .scrollTo({ top: state.chooseIndex * 56, behavior: 'smooth' })
          })
          // 结束loading动画
          myChart.hideLoading()
        }
      },
    })
    // 监听父组件
    watch(
      () => props.visible,
      val => {
        state.dialogFormVisible = val
      }
    )
    // 监听时间范围
    watch(
      () => state.rangeValue,
      val => {
        IntervalTimer1000ms.terminate()
        // 更换样式
        state.chooseMode = 0
        // 重新渲染
        state.initDataPanel(val, state.rangeValue2)
      }
    )
    // 监听时间范围
    watch(
      () => state.rangeValue2,
      val => {
        IntervalTimer1000ms.terminate()
        // 更换样式
        state.chooseMode = 1
        // 重新渲染
        state.initDataPanel(state.rangeValue, val)
      }
    )
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 20px;
}

.data-range {
  position: absolute;
  width: 130px;
  top: 20px;
  left: 170px;
  border: 1px solid #ffffff00;
}

.date-picker {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 320px;
  border: 1px solid #ffffff00;
}

.choose-this {
  border: 1px solid #409eff;
  border-radius: 5px;
}

.data-panel-box {
  position: relative;
  width: 100%;
  height: 500px;

  .data-panel {
    position: absolute;
    width: 700px;
    height: 550px;
  }

  .data-list {
    position: absolute;
    right: 0;
    height: 100%;
    width: 330px;

    .data-list-header {
      position: relative;
      display: flex;
      width: 100%;
      height: 6%;
      font-weight: bold;
      font-size: 15px;

      .header-time-text {
        position: absolute;
        right: 145px;
        top: 5px;
      }

      .header-value-text {
        position: absolute;
        right: 45px;
        top: 5px;
      }
    }

    .data-list-body {
      position: relative;
      width: 100%;
      height: 94%;
      overflow-y: scroll;
      overflow-x: hidden;

      .list-item {
        position: relative;
        display: flex;
        margin-top: 15px;
        margin-bottom: 20px;
        text-align: center;
        cursor: pointer;
        padding: 10px 20px 10px 20px;

        .item-time-box {
          position: relative;
          width: 70%;
        }

        .item-value-box {
          position: relative;
          width: 30%;
          // 省略效果
          overflow: hidden;
          display: -webkit-box;
          /*第几行裁剪*/
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }

      .list-item:hover {
        box-shadow: 2px 2px 10px #d4d4d4a2;
        color: #5470c6;
        font-weight: bold;
      }

      .list-item_active {
        box-shadow: 2px 2px 10px #d4d4d4a2;
        font-weight: bold;
        color: #5470c6;
      }
    }
  }
}

// /* 定义滚动条样式 */
// ::-webkit-scrollbar {
//   width: 5px;
//   height: 6px;
//   background-color: rgba(240, 240, 240, 0);
// }

// /*定义滚动条轨道 内阴影+圆角*/
// ::-webkit-scrollbar-track {
//   box-shadow: inset 0 0 0px rgba(231, 231, 231, 0);
//   border-radius: 10px;
//   background-color: rgba(146, 146, 146, 0);
// }

// /*定义滑块 内阴影+圆角*/
// ::-webkit-scrollbar-thumb {
//   border-radius: 5px;
//   box-shadow: inset 0 0 0px rgba(255, 255, 255, 0);
//   background-color: rgba(235, 235, 235, 0.205);
// }
</style>
