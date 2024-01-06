<template>
  <div class="view">
    <div class="view-title">
      <!-- <img src="@/assets/svg/icon-inspection-manage.svg" class="view-icon"> -->
      <el-icon class="view-icon"><MessageBox /></el-icon>
      巡检管理
    </div>
    <pro-table
      :request="getInspectionList"
      :columns="columns"
      :search="search"
      border="true"
    >
      <!-- 标题栏插槽 -->
      <template #title>
        <!-- 表格题目 -->
        <div class="th-left ">巡检列表</div>
      </template>
      <!-- 状态栏插槽 -->
      <template #status="{ row }">
        <div class="status-slot ">
          <div class="status-slot_inner ">
            <div
              class="dot status-dot "
              :class="
                +row.handleStatus === 0
                  ? 'color-status-0'
                  : +row.handleStatus === 1
                  ? 'color-status-1'
                  : 'color-status-2'
              "
            ></div>
            <div class="status-text ">
              {{
                +row.handleStatus === 0
                  ? '未处理'
                  : +row.handleStatus === 1
                  ? '通过'
                  : '拒绝'
              }}
            </div>
          </div>
        </div>
      </template>
      <!-- 操作栏插槽 -->
      <template #operate="{ row }">
        <span class="fix-el-text-primary operate-text">同意</span>
        <span class="table-text-horizontal-cutting-line"></span>
        <span class="fix-el-text-primary operate-text">拒绝</span>
      </template>
    </pro-table>
  </div>
</template>

<script>
import * as API from '@/api/inspection'
import useStore from '@/pinia/modules/store'
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  // name: 'inspectionList',
  setup() {
    const Store = useStore()
    const state = reactive({
      columns: [
        {
          label: '选择',
          type: 'selection',
        },
        {
          label: '产线名称',
          prop: 'productionLineName',
        },
        {
          label: '产品负责品目',
          prop: 'productPinMu',
        },
        {
          label: '产品负责品番',
          prop: 'productPinFan',
        },
        {
          label: '巡检发起人',
          prop: 'inspectionInitiator',
        },
        {
          label: '巡检发起时间',
          prop: 'inspectionStartTime',
        },
        {
          label: '巡检结束时间',
          prop: 'inspectionEndTime',
        },
        {
          label: '处理状态',
          prop: 'handleStatus',
          tdSlot: 'status',
          align: 'center',
        },
        {
          label: '操作',
          tdSlot: 'operate',
          align: 'center',
          width: 200,
          fixed: 'right',
        },
      ],
      search: {
        labelWidth: '',
        inputWidth: '300px',
        fields: [
          {
            label: '产线名称:',
            type: 'text',
            name: 'productionLineName',
            defaultValue: '请输入产线名称',
          },
        ],
      },
      // 获取巡检列表
      getInspectionList: async params => {
        let obj = {
          params: {
            current: params.current,
            size: params.size,
            key:
              params.sensorName == '请输入产线名称' ? null : params.sensorName,
          },
          supplierCode: Store.supplier.code,
        }
        const { data } = await API.getInspectionList(obj)

        console.log('巡检列表', data)

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
// .status-slot {
//     display: flex;
//     justify-content: center;
//     position: relative;
//     width: 100%;

//     .status-slot_inner {
//         display: flex;
//         justify-content: left;
//         position: relative;
//         width: 60%;

//         .status-dot {
//             position: relative;
//             left: 25%;
//             top: 45%;
//         }

//         .status-text {
//             position: relative;
//             left: 35%;
//         }
//     }
// }
.operate-text {
  padding: 5%;
  cursor: pointer;
}
</style>
