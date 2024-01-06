<template>
  <div class="component-panel">
    <!-- 信息 -->
    <el-descriptions
      title=""
      direction="horizontal"
      :column="2"
      :size="size"
      class="descriptions-panel"
    >
      <el-descriptions-item :label="equipmentLabelArray[0]" align="left">
        {{ infoRef.supplierDeviceName }}
      </el-descriptions-item>
      <el-descriptions-item :label="equipmentLabelArray[1]" align="left">
        {{ infoRef.supplierDeviceCode }}
      </el-descriptions-item>
      <el-descriptions-item :label="equipmentLabelArray[2]" align="left">
        {{ infoRef.supplierProductLineName }}
      </el-descriptions-item>
      <el-descriptions-item :label="equipmentLabelArray[3]" align="left">
        {{ infoRef.supplierProductLineCode }}
      </el-descriptions-item>
      <el-descriptions-item :label="equipmentLabelArray[4]" align="left">
        {{ infoRef.supplierDeviceDescription }}
      </el-descriptions-item>
      <el-descriptions-item :label="equipmentLabelArray[5]" align="left">
        {{ deviceStatusText[infoRef.deviceStatus] }}
      </el-descriptions-item>
      <el-descriptions-item :label="equipmentLabelArray[6]" align="left">
        {{ infoRef.supplierDeviceType }}
      </el-descriptions-item>
      <el-descriptions-item :label="equipmentLabelArray[7]" align="left">
        {{ infoRef.timeout }}
      </el-descriptions-item>
      <el-descriptions-item :label="equipmentLabelArray[8]" align="left">
        {{ $moment(infoRef.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item :label="equipmentLabelArray[9]" align="left">
        {{ $moment(infoRef.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item :label="equipmentLabelArray[10]" align="left">
        {{ infoRef.supplierName }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- 图片 -->
    <div class="image-box transition-500ms">
      <img v-if="imgURL" :src="imgURL" class="image" />
      <el-image v-if="!imgURL" class="block">
        <template #error>
          <div class="image-slot">
            <el-icon>
              <DocumentDelete />
            </el-icon>
          </div>
        </template>
      </el-image>
      <el-upload
        v-model:file-list="fileList"
        class="image-upload-btn"
        action="#"
        :multiple="false"
        :auto-upload="true"
        :on-preview="handlePreview"
        :on-progress="doUpload"
        :limit="1"
      >
        <el-button type="primary">上传图片</el-button>
        <template #tip>
          <div class="el-upload__tip">jpg / png 图片文件不得超过2MB</div>
        </template>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import useStore from '@/pinia/modules/store'
import CONSTANTS from '@/utils/constants'
import * as API from '@/api/equipment'

export default defineComponent({
  setup() {
    const Store = useStore()
    const router = useRouter()

    function source() {
      return {
        createBy: '', // 创建者用户ID ###
        createTime: '', // 创建时间（Date）###
        delFlag: 0, // ---
        supplierDeviceCode: '', // 设备编码 ---
        supplierDeviceDescription: '', // 设备描述 +++
        deviceImagePath: '', // 设备大图（路径）###
        deviceImageWidth: 0, // ###
        deviceImageHeight: 0, // ###
        deviceLocationX: 0, // +++ (调接口若无输入需改成0.0)
        deviceLocationY: 0, // +++ (float类型)
        deviceName: '', // 设备名称 +++
        deviceSensorsNum: 0, // 设备装配传感器数量 ---
        deviceStatus: '', // 设备状态 ---
        supplierDeviceType: '', // 设备类型 ---
        id: null, // ---
        productLineCode: '', // 所属产线编码 ###
        productLineName: '', // 所属产线名称 ###
        supplierCode: '', // 所属供应商编码 ###
        supplierName: '', // 所属供应商名称 ###
        updateBy: '', // 更新者用户ID ###
        updateTime: '', // 更新时间（Date） ###
        timeout: 0,
      }
    }
    const state = reactive({
      infoRef: ref(source()),
      imgURL: ref(),
      equipmentLabelArray: [
        '设备名称:',
        '设备编码:',
        '所属产线:',
        '所属产线编码:',
        '设备描述:',
        '设备状态:',
        '设备类型:',
        '超时时间:',
        '创建时间:',
        '更新时间:',
        '供应商名称:',
      ],
      // 设备的状态
      deviceStatusText: ['未激活', '已连接', '断开连接', '获取状态失败'],
      // 获取设备详细信息
      getEquipment: async () => {
        const { data } = await API.getEquipment(
          router.currentRoute.value.query.id
        )
        state.imgURL = data.deviceImagePath
          ? CONSTANTS.BASE_URL + data.deviceImagePath
          : null
        // 存储 用于后续工作
        Store.equipment.productionLineCode = data.supplierProductLineCode
        Store.equipment.productionLineName = data.supplierProductLineName
        // 存储大图地址用于添加传感器时显示图片
        Store.equipment.imagePath = state.imgURL
        // 存储大图宽高用于计算传感器添加时的选点坐标
        Store.equipment.imageWidth = data.deviceImageWidth
        Store.equipment.imageHeight = data.deviceImageHeight

        state.infoRef = data
      },
      // 上传图片
      doUpload: async (event, uploadFile, uploadFiles) => {
        var formData = new window.FormData()

        formData.append('supplierDeviceCode', Store.equipment.code)
        formData.append('file', uploadFile.raw)

        const { data } = await API.upload(formData)

        state.imgURL = CONSTANTS.BASE_URL + data.imagePath

        Store.equipment.imagePath = state.imgURL
        Store.equipment.imageHeight = data.imageHeight
        Store.equipment.imageWidth = data.imageWidth

        ElMessage.success(CONSTANTS.TIP_UPLOAD_SUCCESS)
      },
    })
    onMounted(() => {
      state.getEquipment()
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

  .descriptions-panel {
    position: relative;
    padding: 80px 100px;
    height: 100%;
    width: 55%;
  }

  .image-box {
    position: relative;
    height: 65%;
    width: 40%;
    top: 10%;

    .image {
      // box-shadow: 2px 2px 10px #d1d1d1;
      margin-bottom: 30px;
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 85%;
    }

    .block {
      position: relative;
      width: 550px;
      margin-bottom: 20px;
      height: 85%;

      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: var(--el-fill-color-light);
        color: var(--el-text-color-secondary);
        font-size: 30px;

        .el-icon {
          font-size: 30px;
        }
      }
    }

    .image-upload-btn {
      position: absolute;
      display: flex;
      bottom: 0;

      .el-upload__tip {
        margin-left: 10px;
      }
    }
  }
  .image-box:hover {
    position: relative;
    height: 67%;
    width: 42%;
    top: 10%;
  }
}

// 调整字体
::v-deep .el-descriptions__body .el-descriptions__table .el-descriptions__cell {
  font-size: 15px;
}
</style>
