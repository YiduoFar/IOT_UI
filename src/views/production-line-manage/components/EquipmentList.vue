<template>
  <div>
    <!-- pro-table没有像el-table那样定义height即可固定表头，无法实现固定表头效果，待解决 -->
    <pro-table
      :request="getEquipmentList"
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
        <div class="th-left ">设备列表</div>
      </template>
      <!-- 工具栏插槽 -->
      <template #toolbar>
        <!-- 添加与批量删除 -->
        <div class="th-right ">
          <!-- 一个刷新按钮 可废弃 共用了add-btn的样式 -->
          <el-icon
            class="th-right-item add-btn transition-250ms"
            @click="refresh"
          >
            <Refresh />
          </el-icon>
          <!-- 添加按钮 -->
          <el-icon
            class="th-right-item add-btn transition-250ms"
            @click="openDialog"
          >
            <Plus />
          </el-icon>
          <!-- 批量删除按钮 -->
          <div
            class="th-right-item-with-text batch-delete-btn transition-250ms"
          >
            <el-icon class="th-right-item-icon">
              <Delete />
            </el-icon>
            <div class="th-right-item-text" @click="openDeleteMore">
              批量删除
            </div>
          </div>
        </div>
      </template>
      <!-- 状态栏插槽 -->
      <template #status="{ row }">
        <div class="status-slot ">
          <div class="status-slot_inner ">
            <div
              class="dot status-dot "
              :class="
                row.deviceStatus === 0
                  ? 'color-status-0'
                  : row.deviceStatus === 1
                  ? 'color-status-1'
                  : 'color-status-2'
              "
            ></div>
            <div class="status-text ">
              {{
                row.deviceStatus === -1
                  ? '获取状态失败'
                  : deviceStatusText[row.deviceStatus]
              }}
            </div>
          </div>
        </div>
      </template>
      <!-- 操作栏插槽 -->
      <template #operate="{ row }">
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
      </template>
    </pro-table>
  </div>
  <!-- 新建面板 -->
  <AddEquipment
    v-model:visible="dialogFormVisible"
    :operateRowId="operateRowId"
  />
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
          label: '设备名称',
          prop: 'supplierDeviceName',
        },
        {
          label: '设备编码',
          prop: 'supplierDeviceCode',
          width: 220,
        },
        {
          label: '状态',
          tdSlot: 'status',
          align: 'center',
          width: 220,
        },
        {
          label: '传感器数量',
          prop: 'supplierSensorsNum',
          align: 'center',
          width: 220,
        },
        {
          label: '设备描述',
          prop: 'supplierDeviceDescription',
          align: 'center',
        },
        {
          label: '操作',
          tdSlot: 'operate',
          align: 'center',
          width: 250,
          fixed: 'right',
        },
      ],
      search: {
        labelWidth: '',
        inputWidth: '300px',
        fields: [
          {
            label: '设备名称:',
            type: 'text',
            name: 'deviceName',
            defaultValue: '请输入设备名称',
          },
        ],
      },
      dialogFormVisible: ref(false),
      operateRowId: ref(null),
      proTable: ref(null),
      deviceStatusText: ['未激活', '已连接', '断开连接', '获取状态失败'],
      openDialog: id => {
        state.dialogFormVisible = true
        // 如果是修改，将会传一个id到子组件
        if (id) {
          state.operateRowId = id
        }
      },
      // 获取设备列表
      getEquipmentList: async params => {
        let obj = {
          params: {
            current: params.current,
            size: params.size,
            key: params.deviceName == '请输入设备名称' ? '' : params.deviceName,
          },
          productLineCode: Store.productionLine.code,
        }
        const { data } = await API.getEquipmentList(obj)
        // console.log('设备列表', data);
        return {
          data: data.list,
          total: data.totalCount,
        }
      },
      // 跳转详情
      goToDetails: row => {
        // 下个页面查会不更新
        Store.equipment.id = row.id
        Store.equipment.name = row.supplierDeviceName
        Store.equipment.code = row.supplierDeviceCode
        router.push({
          path: '/production-line-manage/equipment',
          query: { id: row.id, t: Date.now() },
        })
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
      openDelete: row => {
        ElMessageBox.confirm(
          '您将删除' + row.supplierDeviceName + '，继续吗？',
          CONSTANTS.MESSAGE_BOX_TITLE,
          {
            confirmButtonText: CONSTANTS.MESSAGE_BOX_CONFIRM,
            cancelButtonText: CONSTANTS.MESSAGE_BOX_CANCAL,
            type: 'warning',
          }
        )
          .then(() => {
            doDelete(row)
          })
          .catch(() => {})
      },
      // 打开批量删除
      openDeleteMore: () => {
        ElMessageBox.confirm(
          '您将删除多个设备，继续吗？',
          CONSTANTS.MESSAGE_BOX_TITLE,
          {
            confirmButtonText: CONSTANTS.MESSAGE_BOX_CONFIRM,
            cancelButtonText: CONSTANTS.MESSAGE_BOX_CANCAL,
            type: 'warning',
          }
        )
          .then(() => {
            doDelete()
          })
          .catch(() => {})
      },
    })
    watch(
      () => state.dialogFormVisible,
      val => {
        // 打开时不刷新
        if (!val) {
          state.refresh()
        }
      }
    )
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
</style>
