<template>
  <div class="view">
    <!-- 标题 -->
    <div class="view-title">
      <img
        src="@/assets/svg/icon-production-line-manage.svg"
        class="view-icon"
      />
      产线管理
    </div>
    <!-- 产线列表表格 -->
    <!-- 获取数据：getProductionLineList，表格列配置：columns，隐藏标题栏：hide-title-bar-->
    <pro-table
      :request="getProductionLineList"
      :columns="columns"
      :search="search"
      border="true"
      ref="proTable"
      @selectionChange="handleSelectionChange"
    >
      <!-- 标题栏插槽 -->
      <template #title>
        <!-- 表格题目 -->
        <div class="th-left ">产线列表</div>
      </template>
      <!-- 工具栏插槽 -->
      <template #toolbar>
        <!-- 添加与批量删除 -->
        <div class="th-right ">
          <!-- 一个刷新按钮 共用了add-btn的样式 -->
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
                row.productLineOperationState === '未激活'
                  ? 'color-status-0'
                  : row.productLineOperationState === '正常'
                  ? 'color-status-1'
                  : 'color-status-2'
              "
            ></div>
            <div class="status-text ">{{ row.productLineOperationState }}</div>
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
  <AddProductionLine
    v-model:visible="dialogFormVisible"
    :operateRowId="operateRowId"
  />
</template>

<script>
import { defineComponent, reactive, toRefs, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
// 接口
import * as API from '@/api/production-line'
// Element的提示框
import { ElMessage, ElMessageBox } from 'element-plus'
// 子组件
import AddProductionLine from './components/AddProductionLine.vue'
// pinia
import useStore from '@/pinia/modules/store'
// 常量
import CONSTANTS from '@/utils/constants'

export default defineComponent({
  components: {
    AddProductionLine,
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
      await API.deleteProductionLine(delArrayObj)
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
          label: '产线名称',
          prop: 'supplierProductLineName',
        },
        {
          label: '状态',
          tdSlot: 'status',
          align: 'center',
          width: 200,
        },
        {
          label: '设备数量',
          prop: 'ownDeviceNum',
          align: 'center',
          width: 200,
        },
        {
          label: '产线描述',
          prop: 'productLineDescription',
          align: 'center',
        },
        {
          label: '操作',
          tdSlot: 'operate',
          align: 'center',
          width: 300,
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
            name: 'productLineName',
            defaultValue: '请输入产线名称',
          },
        ],
      },
      dialogFormVisible: ref(false),
      operateRowId: ref(null),
      proTable: ref(null),
      // 打开新增窗口
      openDialog: id => {
        state.dialogFormVisible = true
        // 如果是修改，将会传一个id到子组件
        if (id) {
          state.operateRowId = id
        }
      },
      // 获取产线列表
      getProductionLineList: async params => {
        let obj = {
          params: {
            current: params.current,
            size: params.size,
            key:
              params.productLineName == '请输入产线名称'
                ? ''
                : params.productLineName,
          },
          // 暂时没有获取供应商编码的接口
          supplierCode: Store.supplier.code,
          // supplierCode: 'supplier-abc',
        }
        const { data } = await API.getProductionLineList(obj)
        // console.log(data);
        return {
          data: data.list,
          total: data.totalCount,
        }
      },
      // 跳转详情
      goToDetails: row => {
        // 若放在下个页面查出来 会导致不更新
        Store.productionLine.id = row.id
        Store.productionLine.name = row.supplierProductLineName
        Store.productionLine.code = row.supplierProductLineCode
        router.push({
          path: '/production-line-manage/details',
          query: { id: row.id, t: Date.now() },
        })
      },
      // 刷新
      refresh: () => {
        state.proTable.refresh()
      },
      // 处理多选
      handleSelectionChange: arr => {
        delArray.value = arr
      },
      // 打开删除
      openDelete: row => {
        ElMessageBox.confirm(
          '您将删除' + row.supplierProductLineName + '，继续吗？',
          CONSTANTS.MESSAGE_BOX_TITLE,
          {
            confirmButtonText: CONSTANTS.MESSAGE_BOX_CONFIRM,
            cancelButtonText: CONSTANTS.MESSAGE_BOX_CANCAL,
            type: 'warning',
          }
        )
          .then(async () => {
            doDelete(row)
          })
          .catch(() => {})
      },
      // 打开批量删除
      openDeleteMore: () => {
        ElMessageBox.confirm(
          '您将删除多条产线，继续吗？',
          CONSTANTS.MESSAGE_BOX_TITLE,
          {
            confirmButtonText: CONSTANTS.MESSAGE_BOX_CONFIRM,
            cancelButtonText: CONSTANTS.MESSAGE_BOX_CANCAL,
            type: 'warning',
          }
        )
          .then(async () => {
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
.operate-text {
  padding: 2%;
  cursor: pointer;
}
</style>
