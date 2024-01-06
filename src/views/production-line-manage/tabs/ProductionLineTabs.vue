<template>
  <div class="view">
    <!-- 页头 -->
    <el-page-header :icon="ArrowLeft" title="返回" @back="back">
      <template #content>
        <span class="text-large font-600 mr-3 p-title">{{ title }}</span>
        <img src="@/assets/svg/icon-production-line.svg" class="p-title-icon" />
      </template>
    </el-page-header>
    <!-- 内容面板 -->
    <div class="panel">
      <!-- 标签页 -->
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <!-- 产线详情 -->
        <el-tab-pane label="产线详情" name="first" class="tab-pane">
          <ProductionLineDetails />
        </el-tab-pane>
        <!-- 设备列表 -->
        <el-tab-pane label="设备列表" name="second" class="tab-pane">
          <EquipmentList />
        </el-tab-pane>
        <!-- 脱敏数据 -->
        <el-tab-pane label="脱敏数据" name="third" class="tab-pane">
          <SensorDesensitizationList />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRefs } from 'vue'
import useStore from '@/pinia/modules/store'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import ProductionLineDetails from '@/views/production-line-manage/components/ProductionLineDetails.vue'
import EquipmentList from '@/views/production-line-manage/components/EquipmentList.vue'
import SensorDesensitizationList from '@/views/production-line-manage/components/SensorDesensitizationList.vue'
import ProductionLineData from '@/views/production-line-manage/components/ProductionLineData.vue'

export default defineComponent({
  components: {
    ProductionLineDetails,
    EquipmentList,
    ProductionLineData,
    SensorDesensitizationList,
  },
  setup() {
    const Store = useStore()
    const router = useRouter()
    const tabs = ['first', 'second', 'third']
    const state = reactive({
      title: Store.productionLine.name,
      activeName: ref(Store.tabSelected.productionLineTab),
      // 返回产线列表
      back: () => {
        router.push({
          path: '/production-line-manage',
          query: { t: Date.now() },
        })
      },
      // handleClick
      handleClick: (tab, event) => {
        Store.tabSelected.productionLineTab = tab.paneName
      },
    })
    return {
      ...toRefs(state),
      ArrowLeft,
    }
  },
})
</script>

<style lang="scss" scoped>
.panel {
  padding: 30px 30px;
  height: 70vh;

  .tab-pane {
    padding: 20px 0;
  }
}

.p-title {
  font-size: 20px;
  letter-spacing: 1px;
}

.p-title-icon {
  position: relative;
  top: 1px;
  padding: 0 5px;
  width: 18px;
  height: 18px;
}
</style>
