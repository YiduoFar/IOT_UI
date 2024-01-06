<template>
  <el-form
    :label-position="labelPosition"
    label-width="100px"
    :model="formLabelAlign"
    style="max-width: 460px"
  >
    <el-form-item label="Neuron地址">
      <el-input v-model="infoRef.neuronAddress" />
    </el-form-item>
    <el-form-item label="EMQX地址">
      <el-input v-model="infoRef.emqxAddress" />
    </el-form-item>
    <el-form-item label="topic">
      <el-input v-model="infoRef.topic" />
    </el-form-item>
    <el-form-item style="position: relative; padding-top: 10px;">
      <el-button type="primary" @click="save">保存</el-button>
      <!-- <el-button>Cancel</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import CONSTANTS from '@/utils/constants'
import * as API from '@/api/config'
import { useAccount } from '@/pinia/modules/account'

export default defineComponent({
  setup() {
    const account = useAccount()
    const timer = ref()
    function source() {
      return {
        id: 0,
        neuronAddress: '',
        emqxAddress: '',
        topic: '',
        supplierCode: 'string',
        supplierName: 'string',
        // supplierCode: account.userinfo.supplierCode,
        // supplierName: account.userinfo.supplierName,
      }
    }
    const state = reactive({
      infoRef: source(),
      labelPosition: ref('top'),
      // 保存设置
      save: () => {
        // 防抖
        clearTimeout(timer.value)
        timer.value = setTimeout(async () => {
          // 保存设置
          await API.updateConfig(state.infoRef)
          ElMessage.success(CONSTANTS.TIP_SAVE_SUCCESS)
          // 重新获取
          state.getConfig()
        }, 200)
      },
      // 获取设置
      getConfig: async () => {
        const { code, data } = await API.getConfig('supplier-abc')
        // await API.getConfig(account.userinfo.supplierCode)
        if (code === 10000) {
          state.infoRef = data
        }
      },
    })
    onMounted(() => {
      state.getConfig()
    })
    return {
      ...toRefs(state),
    }
  },
})
</script>
