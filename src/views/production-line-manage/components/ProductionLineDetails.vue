<template>
  <div class="component-panel">
    <!-- 信息 -->
    <el-descriptions
      title=""
      direction="horizontal"
      :column="1"
      :size="size"
      class="descriptions-panel "
    >
      <el-descriptions-item :label="productionLineLabelArray[0]" align="left">
        {{ infoRef.supplierProductLineName }}
      </el-descriptions-item>
      <el-descriptions-item :label="productionLineLabelArray[1]" align="left">
        {{ infoRef.supplierProductLineCode }}
      </el-descriptions-item>
      <el-descriptions-item :label="productionLineLabelArray[2]" align="left">
        {{ infoRef.supplierName }}
      </el-descriptions-item>
      <el-descriptions-item :label="productionLineLabelArray[3]" align="left">
        {{ $moment(infoRef.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item :label="productionLineLabelArray[4]" align="left">
        {{ $moment(infoRef.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
      </el-descriptions-item>
      <el-descriptions-item :label="productionLineLabelArray[5]" align="left">
        {{ infoRef.productLineDescription }}
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
        class="image-upload-btn"
        action="#"
        :multiple="false"
        :auto-upload="true"
        :limit="1"
        :on-progress="upload"
      >
        <el-button type="primary">上传图片</el-button>
        <template #tip>
          <div class="el-upload__tip">
            jpg / png 图片文件不得超过2MB
          </div>
        </template>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, toRefs, reactive } from 'vue'
import * as API from '@/api/production-line'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import useStore from '@/pinia/modules/store'
import CONSTANTS from '@/utils/constants'

export default defineComponent({
  setup() {
    const Store = useStore()
    const router = useRouter()
    function source() {
      return {
        supplierProductLineName: '无数据',
        supplierProductLineCode: '无数据',
        supplierName: '无数据',
        createTime: '无数据',
        updateTime: '无数据',
        productLineDescription: '无数据',
      }
    }
    const state = reactive({
      infoRef: ref(source()),
      imgURL: ref(),
      productionLineLabelArray: [
        '产线名称:',
        '产线编码:',
        '所属供应商:',
        '创建时间:',
        '更新时间:',
        '产线描述:',
      ],
      // 获取产线详细信息
      getProductionLineDetails: async () => {
        const { data } = await API.getProductionLineDetails(
          router.currentRoute.value.query.id
        )

        console.log(data)

        state.imgURL = data.productLineImage
          ? CONSTANTS.BASE_URL + data.productLineImage
          : null

        // 存储
        Store.productionLine.name = data.supplierProductLineName
        Store.productionLine.code = data.supplierProductLineCode
        Store.productionLine.imagePath = state.imgURL

        // 存储大图宽高用于计算设备添加时的选点坐标
        Store.productionLine.imageWidth = data.productLineImageWidth
        Store.productionLine.imageHeight = data.productLineImageHeight

        state.infoRef = data
      },
      // 上传图片
      upload: async (event, uploadFile, uploadFiles) => {
        var formData = new window.FormData()

        formData.append('file', uploadFile.raw)
        formData.append('supplierProductLineCode', Store.productionLine.code)

        const { data } = await API.upload(formData)

        state.imgURL = CONSTANTS.BASE_URL + data.imagePath

        Store.productionLine.imagePath = state.imgURL
        Store.productionLine.imageHeight = data.imageHeight
        Store.productionLine.imageWidth = data.imageWidth

        ElMessage.success(CONSTANTS.TIP_UPLOAD_SUCCESS)
      },
    })
    onMounted(() => {
      state.getProductionLineDetails()
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
    padding: 100px 160px;
    height: 100%;
    width: 50%;
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
        // position: relative;
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
