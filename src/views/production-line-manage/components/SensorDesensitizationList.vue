<template>
  <div>
    <pro-table
      :request="getData"
      :columns="columns"
      :search="search"
      border="true"
      height="250"
      @selectionChange="handleSelectionChange"
      ref="proTable"
    >
      <!-- 标题栏插槽 -->
      <template #title>
        <!-- 表格题目 -->
        <div class="th-left">脱敏数据</div>
      </template>
      <!-- 状态栏插槽 -->
      <template #status="{ row }">
        <div class="status-slot">
          <div class="status-slot_inner">
            <div
              class="dot status-dot"
              :class="
                row.sensorStatus === 1 ? 'color-status-1' : 'color-status-2'
              "
            ></div>
            <div class="status-text">
              {{
                row.sensorStatus === 0
                  ? '已启用'
                  : row.sensorStatus === 1
                  ? '正常'
                  : '异常'
              }}
            </div>
          </div>
        </div>
      </template>
      <!-- 状态栏插槽 -->
      <template #desensitization="{ row }">
        {{ row.desensitization === 0 ? '未脱敏' : '已脱敏' }}
      </template>
      <!-- 工具栏插槽 -->
      <template #toolbar>
        <!-- 添加与批量删除 -->
        <div class="th-right">
          <el-icon
            class="th-right-item refresh-btn transition-250ms"
            @click="refresh"
          >
            <Refresh />
          </el-icon>
          <!-- 添加按钮 -->
          <!-- <el-icon
            class="th-right-item add-btn transition-250ms"
            @click="openDialog"
          >
            <Plus />
          </el-icon> -->
          <!-- 批量删除按钮 -->
          <!-- <div
            class="th-right-item-with-text batch-delete-btn transition-250ms"
          >
            <el-icon class="th-right-item-icon">
              <Delete />
            </el-icon>
            <div class="th-right-item-text" @click="openDeleteMore">
              批量删除
            </div>
          </div> -->
        </div>
      </template>
      <!-- 报警规则插槽 -->
      <template #rule="{ row }">
        {{ row.dataMin }}
        {{ row.dataUnit }}
        ~
        {{ row.dataMax }}
        {{ row.dataUnit }}
      </template>
      <!-- 操作栏插槽 -->
      <!-- <template #operate="{ row }">
        <span
          class="fix-el-text-primary operate-text"
          @click="goToDetails(row)"
        >
          查看
        </span>
        <span class="table-text-horizontal-cutting-line"></span>
        <span
          class="fix-el-text-primary operate-text"
          @click="openDialog(row.id)"
        >
          修改
        </span>
        <span class="table-text-horizontal-cutting-line"></span>
        <span class="fix-el-text-primary operate-text" @click="openDelete(row)">
          删除
        </span>
      </template> -->
    </pro-table>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Element的提示框
import { ElMessage, ElMessageBox } from 'element-plus'
// 常量
import CONSTANTS from '@/utils/constants'
// 接口
import * as API from '@/api/equipment'
// pinia
import useStore from '@/pinia/modules/store'

import AddEquipment from './AddEquipment.vue'

export default defineComponent({
  components: {
    AddEquipment,
  },
  setup() {
    const Store = useStore()
    const router = useRouter()
    const delArray = ref([])
    // 删除
    const doDelete = async row => {
      var delArrayObj = []
      if (!row) {
        // 批量
        for (let i = 0, n = delArray.value.length; i < n; i++) {
          delArrayObj.push(delArray.value[i].id)
        }
      } else {
        // 单条
        delArrayObj.push(row.id)
      }
      await API.deleteEquipment(delArrayObj)
      ElMessage.success(CONSTANTS.TIP_DEL_SUCCESS)
      state.refresh()
    }
    const state = reactive({
      columns: [
        {
          label: '选择',
          type: 'selection',
        },
        {
          label: '传感器名称',
          prop: 'sensorName',
        },
        {
          label: '编码',
          prop: 'sensorCode',
          width: 250,
        },
        {
          label: '状态',
          tdSlot: 'status',
          align: 'center',
          width: 120,
        },
        {
          label: '类型',
          align: 'center',
          prop: 'sensorType',
          width: 120,
        },
        {
          label: '脱敏状态',
          tdSlot: 'desensitization',
          align: 'center',
          width: 120,
        },
        {
          label: '数据类型',
          align: 'center',
          prop: 'dataType',
          width: 120,
        },
        {
          label: '扫描速率',
          align: 'center',
          prop: 'scanRate',
          width: 120,
        },
        {
          label: '报警规则',
          align: 'center',
          tdSlot: 'rule',
        },
        {
          label: '描述',
          align: 'center',
          prop: 'sensorDescription',
        },
        // {
        //   label: '操作',
        //   tdSlot: 'operate',
        //   align: 'center',
        //   width: 150,
        //   fixed: 'right',
        // },
      ],
      search: {
        labelWidth: '',
        // inputWidth: '300px',
        fields: [
          {
            label: '传感器是否脱敏:',
            type: 'radio-button',
            options: [
              {
                name: '已脱敏',
                value: 1,
              },
              {
                name: '未脱敏',
                value: 0,
              },
            ],
            name: 'desensitization',
            defaultValue: 1,
          },
        ],
      },
      proTable: ref(null),
      // 获取脱敏数据列表
      getData: async params => {
        let obj = {
          pageStr: {
            current: params.current,
            size: params.size,
            keyword: '',
            // keyword:
            //   params.deviceName == '请输入传感器名称' ? '' : params.deviceName,
          },
          supplierProductLineCode: Store.productionLine.code,
          desensitization: params.desensitization,
        }
        const { data } = await API.getByDesensitizationAndProductLineCode(obj)
        console.log('脱敏列表', data)
        return {
          data: data.list,
          total: data.totalCount,
        }
      },
      // 刷新
      refresh: () => {
        state.proTable.refresh()
      },
      // 处理选择
      handleSelectionChange: arr => {
        delArray.value = arr
      },
      // 打开删除
      // openDelete: row => {
      //   ElMessageBox.confirm(
      //     '您将删除' + row.deviceName + '，继续吗？',
      //     CONSTANTS.MESSAGE_BOX_TITLE,
      //     {
      //       confirmButtonText: CONSTANTS.MESSAGE_BOX_CONFIRM,
      //       cancelButtonText: CONSTANTS.MESSAGE_BOX_CANCAL,
      //       type: 'warning',
      //     }
      //   )
      //     .then(() => {
      //       doDelete(row)
      //     })
      //     .catch(() => {})
      // },
      // 打开批量删除
      // openDeleteMore: () => {
      //   ElMessageBox.confirm(
      //     '您将删除多个设备，继续吗？',
      //     CONSTANTS.MESSAGE_BOX_TITLE,
      //     {
      //       confirmButtonText: CONSTANTS.MESSAGE_BOX_CONFIRM,
      //       cancelButtonText: CONSTANTS.MESSAGE_BOX_CANCAL,
      //       type: 'warning',
      //     }
      //   )
      //     .then(() => {
      //       doDelete()
      //     })
      //     .catch(() => {})
      // },
    })
    // watch(
    //   () => state.dialogFormVisible,
    //   val => {
    //     // 打开时不刷新
    //     if (!val) {
    //       state.refresh()
    //     }
    //   }
    // )
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
  padding: 3%;
  cursor: pointer;
}

.refresh-btn {
  margin-right: 10px;
  cursor: pointer;
}
</style>
