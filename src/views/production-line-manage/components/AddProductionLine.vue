<template>
  <!-- 添加/修改产线 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    @closed="close"
    @open="open"
    width="600px"
    top="15vh"
    draggable
  >
    <!-- 骨架屏 -->
    <el-skeleton :rows="13" animated v-if="!isReady" />
    <!-- 表单 -->
    <el-form v-if="isReady" :model="infoRef" label-position="left">
      <el-form-item :label="formLabel[0]" :label-width="100">
        <el-input
          type="text"
          v-model="infoRef.supplierProductLineName"
          :placeholder="formInputPlaceholder[0]"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item :label="formLabel[1]" :label-width="100">
        <el-input
          type="text"
          v-model="infoRef.productLineResponsibleCommodityNo"
          :placeholder="formInputPlaceholder[1]"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item :label="formLabel[2]" :label-width="100">
        <el-input
          type="text"
          v-model="infoRef.productLineResponsiblePartNo"
          :placeholder="formInputPlaceholder[2]"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item :label="formLabel[3]" :label-width="100">
        <el-input
          type="textarea"
          resize="none"
          :rows="4"
          v-model="infoRef.productLineDescription"
          :placeholder="formInputPlaceholder[3]"
          autocomplete="off"
        />
      </el-form-item>
      <!-- 上传大图 -->
      <el-form-item :label="formLabel[4]" :label-width="100">
        <!-- --------el-upload属性描述 (list-type="picture-card"的一种图片上传的实现方法)-------- -->
        <!-- v-model:file-list="fileList" 很重要的一个，绑定后可以回显图片 -->
        <!-- multiple 是否多选文件 -->
        <!-- auto-upload 是否自动上传  true才会走on-progress,(或者手动.submit()未知如何使用) -->
        <!-- show-file-list 不显示上传文件列表 -->
        <!-- before-upload 在文件上传前检查格式 -->
        <!-- http-request 覆盖默认的 Xhr 行为，允许自行实现上传文件的请求 -->
        <!-- limit 允许上传文件的最大数量 -->
        <!-- on-exceed 当超出限制时，执行的钩子函数 -->
        <!-- :on-remove 移除文件的钩子 -->
        <!-- :on-progress 上传文件的钩子 (此处可以不写，用onChange监听变化，把文件存到本地，再手动调用上传方法 代替) -->
        <!-- on-success 上传成功的钩子 -->
        <!-- on-error 上传失败的钩子 -->
        <!-- on-preview 点击文件列表中已上传的文件时的钩子 -->
        <el-upload
          v-model:file-list="fileList"
          action="#"
          list-type="picture-card"
          :multiple="false"
          :auto-upload="true"
          :show-file-list="true"
          :limit="1"
          :on-exceed="handleExceed"
          :on-remove="handleRemove"
          :on-progress="doUpload"
          :on-preview="handlePictureCardPreview"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <!-- 显示缩略图的dialog -->
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <template #footer v-if="isReady">
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, reactive, watch, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as API from '@/api/production-line'
import CONSTANTS from '@/utils/constants'
import useStore from '@/pinia/modules/store'
import { useAccount } from '@/pinia/modules/account'

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    operateRowId: {
      type: Number,
      default: null,
    },
  },
  setup(props, ctx) {
    const Store = useStore()
    function source() {
      return {
        createBy: Store.supplier.id,
        createTime: null,
        delFlag: 0,
        id: null,
        multipartFile: [],
        supplierProductLineCode: '', // 产线编码
        productLineDescription: '', // 产线描述
        productLineDeviceNum: 0, // 产线装配设备数量
        productLineImage: '', // 产线大图(路径)
        productLineImageWidth: 0,
        productLineImageHeight: 0,
        supplierProductLineName: '', // 产线名称
        productLineResponsibleCommodityNo: '', // 产线负责品目
        productLineResponsiblePartNo: '', // 产线负责品番
        productLineStatus: '正常', // 产线状态 ----
        ownWorkerNum: 0, // 产线装配工位数量 ----
        ownDeviceNum: 0, // 产线装配设备数量 ----
        supplierCode: Store.supplier.code, // 所属供应商编码
        supplierName: Store.supplier.name, // 所属供应商名称
        supOrgid: Store.supplier.supOrgid, // 供应商组织架构ID
        updateBy: Store.supplier.id, // 更新者用户ID
        updateTime: null, // 更新时间
        remark: '无备注信息',
      }
    }
    // 重置
    const reset = () => {
      state.infoRef = source()
      // 清空fileList
      state.fileList = []
      // 关闭
      ctx.emit('update:visible', false)
      // isReady
      state.isReady = false
    }
    const state = reactive({
      infoRef: ref(source()),
      title: ref(''),
      // operateRowId: ref(null),
      isReady: ref(false),
      dialogFormVisible: ref(false),
      fileList: ref([]),
      formLabel: [
        '产线名称',
        '产线负责品目',
        '产线负责品番',
        '产线描述',
        '产线大图',
      ],
      formInputPlaceholder: [
        '请输入产线名称',
        '请输入产线负责品目',
        '请输入产线负责品番',
        '请输入产线描述',
        '请输入产线大图',
      ],
      dialogImageUrl: ref(''),
      dialogVisible: ref(false),
      // 打开窗口时调用
      open: async () => {
        if (typeof props.operateRowId == 'number') {
          // 修改
          state.title = '修改产线信息'
          // 获取表单数据
          const { data } = await API.getProductionLineDetails(
            props.operateRowId
          )
          state.infoRef = data
          state.isReady = true
          setTimeout(() => {
            // 有图的话显示出来
            if (data.productLineImage) {
              state.fileList.push({
                name: data.supplierProductLineName,
                url: CONSTANTS.BASE_URL + data.productLineImage,
              })
            }
          }, 100)
        } else {
          // 添加
          state.title = '添加产线'
          state.isReady = true
        }
      },
      // 添加/修改产线
      confirm: async () => {
        if (typeof props.operateRowId != 'number') {
          await API.addProductionLine(state.infoRef)
          ElMessage.success(CONSTANTS.TIP_ADD_SUCCESS)
        } else {
          await API.editProductionLine(state.infoRef)
          ElMessage.success(CONSTANTS.TIP_EDIT_SUCCESS)
        }
        reset()
      },
      close: () => {
        reset()
      },
      // 上传/修改产线图片
      doUpload: async (event, uploadFile, uploadFiles) => {
        var formData = new window.FormData()

        if (typeof props.operateRowId != 'number') {
          // 新增
          formData.append('supplierProductLineCode', '')
        } else {
          // 修改
          formData.append(
            'supplierProductLineCode',
            state.infoRef.supplierProductLineCode
          )
        }

        formData.append('file', uploadFile.raw)

        // 上传 得到服务器返回的url
        const { data } = await API.upload(formData)

        // 赋值给对象
        state.infoRef.productLineImage = data.imagePath
        state.infoRef.productLineImageWidth = data.imageWidth
        state.infoRef.productLineImageHeight = data.imageHeight

        // 存储大图宽高用于计算设备添加时的选点坐标
        Store.productionLine.imagePath = data.imagePath
        Store.productionLine.imageWidth = data.imageWidth
        Store.productionLine.imageHeight = data.imageHeight

        // 回显到缩略图
        state.fileList.push({
          name: uploadFile.name,
          url: CONSTANTS.BASE_URL + data.imagePath,
        })

        ElMessage.success(CONSTANTS.TIP_UPLOAD_SUCCESS)
      },
      // 移除图片的钩子
      handleRemove: (uploadFile, uploadFiles) => {
        // 暂时没有删除图片的接口
        uploadFiles.splice(0, 1)
      },
      // 查看大图的钩子
      handlePictureCardPreview: uploadFile => {
        state.dialogImageUrl = uploadFile.url
        state.dialogVisible = true
      },
      // 处理多张图片上传的钩子
      handleExceed: uploadFile => {
        ElMessage.warning('不支持上传多张图片')
      },
    })
    watch(
      () => props.visible,
      val => {
        state.dialogFormVisible = val
      }
    )
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 25px;
}
</style>
