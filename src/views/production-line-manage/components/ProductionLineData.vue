<template>
  <div class="component-panel">
    <!-- 数据面板 -->
    <div class="data-panel">
      <!-- 柱状图 -->
      <div class="data-item-1 " id="dataChart1"></div>
      <!-- 饼图 -->
      <div class="data-item-2 " id="dataChart2"></div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  onUpdated,
} from 'vue'
import * as echarts from 'echarts'
export default defineComponent({
  setup() {
    const state = reactive({
      option: {
        title: {
          text: 'Rainfall vs Evaporation',
          subtext: 'Fake Data',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['Rainfall', 'Evaporation'],
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Rainfall',
            type: 'bar',
            data: [
              2.0,
              4.9,
              7.0,
              23.2,
              25.6,
              76.7,
              135.6,
              162.2,
              32.6,
              20.0,
              6.4,
              3.3,
            ],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' },
              ],
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }],
            },
          },
          {
            name: 'Evaporation',
            type: 'bar',
            data: [
              2.6,
              5.9,
              9.0,
              26.4,
              28.7,
              70.7,
              175.6,
              182.2,
              48.7,
              18.8,
              6.0,
              2.3,
            ],
            markPoint: {
              data: [
                { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
                { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 },
              ],
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }],
            },
          },
        ],
      },
      option2: {
        title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
    })
    const initeCharts = () => {
      let myChart = echarts.init(document.getElementById('dataChart1'))
      // 绘制图表
      myChart.setOption(state.option)

      let myChart2 = echarts.init(document.getElementById('dataChart2'))
      // 绘制图表
      myChart2.setOption(state.option2)
    }

    onMounted(() => {
      initeCharts()
    })

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.component-panel {
  position: relative;
  display: flex;
  height: 60vh;
  border-radius: 10px;
  background-color: #fff;
  padding: 25px;
  width: 100%;

  .data-panel {
    position: relative;
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;

    // 用%会渲染失败
    .data-item-1 {
      position: relative;
      width: 800px;
      height: 600px;
    }

    .data-item-2 {
      position: relative;
      margin-top: 10px;
      margin-left: 20px;
      width: 60vh;
      height: 70vh;
    }
  }
}
</style>
