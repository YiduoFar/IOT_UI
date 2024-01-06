<template>
  <div class="component-panel">
    <!-- pro-table没有像el-table那样定义height即可固定表头，无法实现固定表头效果，待解决 -->
    <pro-table
      :request="getEquipmentDataList"
      :columns="columns"
      :search="search"
      border="true"
      height="250"
      ref="proTable"
    >
      <!-- 标题栏插槽 -->
      <template #title>
        <!-- 表格题目 -->
        <div class="th-left ">设备数据</div>
      </template>
      <!-- 工具栏插槽 -->
      <template #toolbar>
        <div class="refresh-btn ">
          <!-- 绑定的value2应该在后端传来的对象里的属性值 -->
          <div
            class="refresh-btn-text transition-500ms"
            :class="{ isActive: value2, isNotActive: !value2 }"
          >
            实时刷新
          </div>
          <el-switch
            v-model="value2"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            class="ml-2 refresh-btn-switch"
            size="small"
            style="--el-switch-on-color: #13ce66;"
            @change="change"
          />
        </div>
      </template>
      <!-- 采样时间插槽 -->
      <template #time="{ row }">
        {{ $moment(row.timestamp).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <!-- 采样值插槽 -->
      <!-- <template #samplingValue="{ row }">
                {{ row.samplingValue.value }}
                {{ row.samplingValue.type }}
            </template> -->
      <!-- 操作栏插槽 -->
      <template #operate="{ row }">
        <span class="fix-el-text-primary operate-text" @click="openDialog(row)">
          详情
        </span>
      </template>
    </pro-table>
  </div>
  <!-- 详情面板 -->
  <SensorDetailsPanel
    v-model:visible="dialogFormVisible"
    :sensorCode="sensorCode"
  />
</template>

<script>
import { defineComponent, ref, reactive, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as API from '@/api/equipment'
import useStore from '@/pinia/modules/store'
import SensorDetailsPanel from './SensorDetailsPanel.vue'

export default defineComponent({
  components: {
    SensorDetailsPanel,
  },
  setup() {
    const Store = useStore()
    const state = reactive({
      columns: [
        {
          label: '选择',
          type: 'selection',
        },
        {
          label: '传感器编码',
          prop: 'sensorCode',
        },
        {
          label: '设备编码',
          align: 'center',
          prop: 'deviceCode',
        },
        {
          label: '采样时间',
          align: 'center',
          tdSlot: 'time',
        },
        {
          label: '采样值',
          // tdSlot: 'samplingValue',
          prop: 'value',
          align: 'center',
        },
        {
          label: '操作',
          tdSlot: 'operate',
          align: 'center',
          fixed: 'right',
        },
      ],
      search: {
        labelWidth: '',
        inputWidth: '300px',
        fields: [
          {
            label: '传感器编码:',
            type: 'text',
            name: 'sensorName',
            defaultValue: '请输入传感器编码',
          },
        ],
      },
      dialogFormVisible: ref(false),
      sensorCode: ref(''),
      value2: ref(false),
      timer: null,
      proTable: ref(null),
      // 打开详情
      openDialog: row => {
        Store.sensor.id = row.id
        Store.sensor.code = row.sensorCode
        state.dialogFormVisible = true
        // state.sensorCode =
      },
      // 获取设备数据
      getEquipmentDataList: async params => {
        let obj = {
          params: {
            current: params.current,
            size: params.size,
            key:
              params.sensorName == '请输入传感器编码'
                ? null
                : params.sensorName,
          },
          deviceCode: Store.equipment.code,
        }
        const { data } = await API.getEquipmentDataList(obj)
        // console.log('设备数据', data);
        return {
          data: data.list,
          total: data.totalCount,
        }
      },
      // 刷新
      refresh: () => {
        state.proTable.refresh()
      },
      // 实时刷新
      change: val => {
        clearInterval(state.timer)
        if (val) {
          state.timer = setInterval(() => {
            state.refresh()
          }, 1000)
        }
      },
    })
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
// 表格的边框和高度
::v-deep .page-box .search {
  border-radius: 10px 10px 0 0;
  // 合并搜索和表格主体
  margin-bottom: 0px !important;
}

::v-deep .page-box .table {
  // 限制表格内容 防止溢出
  max-height: 42vh;
  overflow: scroll;
}

::v-deep .page-box .pagination {
  border-radius: 0 0 10px 10px;
}

.operate-text {
  padding: 5%;
  cursor: pointer;
}

.refresh-btn {
  position: relative;
  width: 150px;
  display: flex;
  align-items: center;
  font-size: 15px;

  .refresh-btn-text {
    position: absolute;
    left: 30px;

    &.isActive {
      color: #2cb64a;
    }

    &.isNotActive {
      color: #bbbbbb;
    }
  }

  .refresh-btn-switch {
    position: absolute;
    right: 20px;
  }
}
</style>
