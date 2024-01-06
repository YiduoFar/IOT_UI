<template>
  <div class="view">
    <!-- 页头 -->
    <el-page-header :icon="ArrowLeft" title="返回" @back="back">
      <template #content>
        <span class="text-large font-600 mr-3 e-title">{{ title }}</span>
        <img src="@/assets/svg/icon-equipment.svg" class="e-title-icon" />
      </template>
    </el-page-header>
    <!-- 内容面板 -->
    <div class="panel">
      <!-- 标签页 -->
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <template v-for="(item, index) in 4" :key="index">
          <el-tab-pane
            :label="tabLabel[index]"
            :name="tabName[index]"
            class="tab-pane"
          >
            <component
              v-bind:is="tabComponet[index]"
              :key="Date.now()"
            ></component>
          </el-tab-pane>
        </template>
        <!-- 设备详情 -->
        <!-- 传感器列表 -->
        <!-- 设备数据 -->
        <!-- 设备异常 -->
        <!-- <el-tab-pane label="设备详情" name="first" class="tab-pane ">
          <EquipmentDetails />
        </el-tab-pane>
        <el-tab-pane label="传感器列表" name="second" class="tab-pane">
          <SensorList />
        </el-tab-pane>
        <el-tab-pane label="设备数据" name="third" class="tab-pane">
          <EquipmentData />
        </el-tab-pane>
        <el-tab-pane label="设备异常" name="fourth" class="tab-pane">
          <EquipmentError />
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import useStore from '@/pinia/modules/store'
import EquipmentDetails from '@/views/production-line-manage/components/EquipmentDetails.vue'
import SensorList from '@/views/production-line-manage/components/SensorList.vue'
import EquipmentData from '@/views/production-line-manage/components/EquipmentData.vue'
import EquipmentError from '@/views/production-line-manage/components/EquipmentError.vue'

export default defineComponent({
  components: {
    EquipmentDetails,
    SensorList,
    EquipmentData,
    EquipmentError,
  },
  setup() {
    const Store = useStore()
    const router = useRouter()
    const state = reactive({
      title: Store.equipment.name,
      activeName: ref(Store.tabSelected.equipmentTab),
      tabLabel: ['设备详情', '传感器列表', '设备数据', '设备异常'],
      tabName: ['first', 'second', 'third', 'fourth'],
      tabComponet: [
        'EquipmentDetails',
        'SensorList',
        'EquipmentData',
        'EquipmentError',
      ],
      back: () => {
        Store.tabSelected.equipmentTab = 'first'
        router.push({
          path: '/production-line-manage/details',
          query: { id: Store.productionLine.id, t: Date.now() },
        })
      },
      handleClick: (tab, event) => {
        Store.tabSelected.equipmentTab = tab.paneName
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

.e-title {
  font-size: 20px;
  letter-spacing: 1px;
}

.e-title-icon {
  position: relative;
  top: 2px;
  padding: 0px 5px;
  width: 20px;
  height: 20px;
}
</style>
