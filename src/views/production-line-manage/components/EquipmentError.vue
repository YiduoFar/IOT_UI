<template>
  <div class="component-panel">
    <!-- pro-table没有像el-table那样定义height即可固定表头，无法实现固定表头效果，待解决 -->
    <pro-table
      :request="getEquipmentError"
      :columns="columns"
      :search="search"
      border="true"
      height="250"
    >
      <!-- 标题栏插槽 -->
      <template #title>
        <!-- 表格题目 -->
        <div class="th-left ">异常记录</div>
      </template>
      <template #time="{ row }">
        {{ $moment(row.abnormalTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </pro-table>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue'
import useStore from '@/pinia/modules/store'
import * as API from '@/api/equipment'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import CONSTANTS from '@/utils/constants'

export default defineComponent({
  setup() {
    const Store = useStore()

    const state = reactive({
      columns: [
        {
          label: '选择',
          type: 'selection',
        },
        {
          label: '供应商名称',
          prop: 'supplierName',
        },
        {
          label: '产线名称',
          prop: 'productLineName',
          width: 180,
          align: 'center',
        },
        {
          label: '设备名称',
          align: 'center',
          prop: 'deviceName',
          width: 180,
        },
        {
          label: '设备编码',
          align: 'center',
          width: 180,
          prop: 'deviceCode',
        },
        {
          label: '传感器名称',
          width: 180,
          align: 'center',
          prop: 'sensorName',
        },
        {
          label: '传感器编码',
          width: 180,
          align: 'center',
          prop: 'sensorCode',
        },
        {
          label: '异常发生时间',
          align: 'center',
          tdSlot: 'time',
          prop: 'abnormalTime',
        },
      ],
      search: {
        labelWidth: '110px',
        inputWidth: '280px',
        fields: [
          {
            label: '传感器名称:',
            type: 'text',
            name: 'sensorName',
            defaultValue: '请输入传感器名称',
          },
          {
            label: '异常发生时间:',
            type: 'daterange',
            name: 'errorTime',
            defaultValue: '请输入异常发生时间',
            trueNames: ['startTime', 'endTime'],
          },
        ],
      },
      // 获取设备异常列表
      getEquipmentError: async params => {
        let obj = {
          params: {
            current: params.current,
            size: params.size,
            key:
              params.sensorName == '请输入传感器名称' ? '' : params.sensorName,
            startTime: params.startTime,
            endTime: params.endTime,
          },
          deviceCode: Store.equipment.code,
        }
        const { data } = await API.getEquipmentError(obj)
        // console.log('设备异常', data);
        return {
          data: data.list,
          total: data.totalCount,
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

// 多行搜索栏时 调整tablehead的padding
::v-deep .page-box .head {
  padding-bottom: 15px;
  padding-top: 0;
}

::v-deep .page-box .pagination {
  border-radius: 0 0 10px 10px;
}

.operate-text {
  padding: 5%;
  cursor: pointer;
}

// 表格搜索栏
::v-deep .page-box .search {
  padding: 25px 30px;
  margin-bottom: 15px;

  .el-form-item {
    margin-bottom: 15px !important;
    margin-right: 30px;
  }

  .el-form-item:nth-child(4) {
    margin-bottom: 0px !important;
  }

  .el-form-item:last-child {
    margin-bottom: 0px !important;
  }
}

::v-deep .el-form-item__label {
  justify-content: flex-start;
}

::v-deep .el-form-item__content {
  align-items: flex-start;
}
</style>
