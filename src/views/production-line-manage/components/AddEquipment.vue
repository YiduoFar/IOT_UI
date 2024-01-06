<template>
  <!-- 添加设备 -->
  <el-dialog
    v-model="dialogFormVisible"
    id="dialog"
    :title="title"
    @closed="close"
    width="1030px"
    :top="dialogTop"
    @open="open"
    draggable
  >
    <!-- 骨架屏 -->
    <el-skeleton :rows="19" animated v-if="!isReady" />
    <!-- 表单 -->
    <el-form
      v-if="isReady"
      :model="infoRef"
      label-position="left"
      :inline="true"
      class="form-inline"
    >
      <el-form-item class="form-box">
        <div class="form-box_inner">
          <div class="form-box_inner_left">
            <!-- 设备名称 -->
            <div class="form-item">
              <div class="form-item-label">
                {{ formLabel[0] }}
              </div>
              <el-input
                type="text"
                v-model="infoRef.supplierDeviceName"
                :placeholder="formInputPlaceholder[0]"
                autocomplete="off"
              />
            </div>
            <!-- 设备描述 -->
            <div class="form-item">
              <div class="form-item-label">
                {{ formLabel[1] }}
              </div>
              <el-input
                type="textarea"
                resize="none"
                :rows="4"
                v-model="infoRef.supplierDeviceDescription"
                :placeholder="formInputPlaceholder[1]"
                autocomplete="off"
              />
            </div>
          </div>
          <div class="form-box_inner_right">
            <!-- 上传大图 -->
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
            <div class="form-item">
              <div class="form-item-label">
                {{ formLabel[2] }}
              </div>
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
            </div>
            <!-- 超时时间 -->
            <!-- <div class="form-item l">
                            {{ formLabel[4] }}
                            <el-input-number v-model="infoRef.timeout" class="mx-4" :precision="2" :step="0.01" :min="0"
                                :max="100" controls-position="right" @change="handleChange" step-strictly />
                            &nbsp;&nbsp;&nbsp;&nbsp;s / (秒)
                        </div> -->
          </div>
        </div>
      </el-form-item>
      <!-- 设备区域中心 -->
      <el-form-item
        :label="formLabel[3]"
        :label-width="120"
        style="position: relative; width: 100%"
      >
        <div class="location-box">
          <!-- X Y 输入框 -->
          <div class="location-input">
            <div class="location">X</div>
            <el-input
              type="text"
              v-model="infoRef.deviceLocationX"
              :placeholder="locationShow.showX"
              autocomplete="off"
              style="width: 154px; margin-right: 20px"
            />
            <div class="location">Y</div>
            <el-input
              type="text"
              v-model="infoRef.deviceLocationY"
              :placeholder="locationShow.showY"
              autocomplete="off"
              style="width: 154px"
            />

            <div class="timeout">
              {{ formLabel[4] }}
              <div class="timeout-input">
                <el-input-number
                  v-model="infoRef.timeout"
                  :precision="2"
                  :step="0.01"
                  :min="0"
                  :max="100"
                  controls-position="right"
                  @change="handleChange"
                  step-strictly
                />
                &nbsp;&nbsp;&nbsp;&nbsp;s / (秒)
              </div>
            </div>
          </div>
          <!-- 图片选点 -->
          <div class="location-selector" id="location-selector">
            <div
              class="location-selector-box"
              @mouseenter="changeMouseSelecting"
              @mouseleave="changeMouseSelecting"
            >
              <!-- 图 -->
              <img
                v-if="imgURL"
                :src="imgURL"
                @click="handleImageClick"
                class="location-selector_inner_img"
              />
              <el-image v-if="!imgURL" class="block">
                <template #error>
                  <div class="image-slot">
                    <el-icon>
                      <DocumentDelete />
                    </el-icon>
                    &nbsp; 未上传图片
                  </div>
                </template>
              </el-image>
              <!-- 框 -->
              <div
                v-if="imgURL"
                class="follow-box mouse-follow trans-opacity-250ms"
              ></div>
              <div
                v-if="imgURL"
                class="follow-box mouse-follow2 trans-opacity-250ms"
              ></div>
              <div
                v-if="imgURL"
                class="follow-box mouse-follow3 trans-opacity-250ms"
              >
                <div class="location-show">
                  x:{{ locationShow.showX }} &nbsp; y:{{ locationShow.showY }}
                </div>
              </div>
              <div
                v-if="imgURL"
                class="follow-box mouse-follow4 trans-opacity-250ms"
              ></div>
              <!-- 点 -->
              <div
                v-if="imgURL"
                class="marker transition-250ms"
                ref="marker"
                id="marker"
                @mouseenter="changeMouseSelecting"
                @mouseleave="changeMouseSelecting"
              ></div>
            </div>
          </div>
        </div>
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
import { defineComponent, reactive, watch, ref, toRefs, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import useStore from '@/pinia/modules/store'
import * as API from '@/api/equipment'
import CONSTANTS from '@/utils/constants'

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
    let eventBoxWidth = -1
    let eventBoxHeight = -1
    // let eventBoxWidth2 = -1
    // let eventBoxHeight2 = -1
    let isMouseSelecting = false
    // Bean ( ---默认值 +++绑定输入框值 ###需计算值或需取值 )
    function source() {
      return {
        createBy: '', // 创建者用户ID ###
        createTime: null, // 创建时间（Date）###
        delFlag: 0, // ---
        supplierDeviceCode: '', // 设备编码 ---
        supplierDeviceName: '', // 设备名称 +++
        supplierDeviceDescription: '', // 设备描述 +++
        deviceImagePath: '', // 设备大图（路径）###
        deviceImageWidth: 0, // ###
        deviceImageHeight: 0, // ###
        deviceLocationX: null, // +++ (调接口若无输入需改成0.0)
        deviceLocationY: null, // +++ (float类型)
        // deviceSensorsNum: 0, // 设备装配传感器数量 ---
        supplierSensorsNum: 0, // 供应商设备拥有传感器数量 ---
        deviceStatus: '', // 设备状态 ---
        supplierDeviceType: '', // 设备类型 ---
        id: null, // ---
        supplierProductLineCode: Store.productionLine.code, // 所属产线编码 ###
        supplierProductLineName: Store.productionLine.name, // 所属产线名称 ###
        supplierCode: Store.supplier.code, // 所属供应商编码 ###
        supOrgid: Store.supplier.supOrgid, // 供应商组织架构ID
        supplierName: '', // 所属供应商名称 ###
        updateBy: '', // 更新者用户ID ###
        updateTime: null, // 更新时间（Date） ###
        timeout: 2.5,
        remark: '无备注信息',
      }
    }
    // 监听鼠标移动
    const updatePosition = event => {
      const container = event.target.getBoundingClientRect()

      // 获取鼠标在div内的x、y
      const x = event.offsetX
      const y = event.offsetY

      // 计算四个跟随div的宽高
      const x1 = x - 5
      const y1 = y - 5

      const x2 = container.width - x - 5
      const y2 = container.height - y - 5

      const x3 = x2
      const y3 = y1

      const x4 = x1
      const y4 = y2

      // 鼠标移动就更新选点图片窗口的宽高，应该有更好的解决方案
      // eventBoxWidth = document.getElementsByClassName('location-selector-box')[0].offsetWidth
      // eventBoxHeight = document.getElementsByClassName('location-selector-box')[0].offsetHeight
      // // 窗口变化时 选点位置不改变的保护措施
      // if (eventBoxWidth != eventBoxWidth2 || eventBoxHeight != eventBoxHeight2) {
      //     // 记录变化后的窗口宽高
      //     eventBoxWidth2 = eventBoxWidth
      //     eventBoxHeight2 = eventBoxHeight
      //     // 如果已经选点 由于窗口已经变化 请移动它
      //     if (state.infoRef.deviceLocationX) {
      //         markerMove(state.infoRef.deviceLocationX, state.infoRef.deviceLocationY)
      //     }
      // }

      // 当鼠标在图片中时的操作
      if (state.imgURL) {
        if (isMouseSelecting) {
          // 计算 并 实时显示真实的x、y
          state.locationShow.showX = (
            Store.productionLine.imageWidth *
            (x / eventBoxWidth)
          ).toFixed(2)
          state.locationShow.showY = (
            Store.productionLine.imageHeight *
            (y / eventBoxHeight)
          ).toFixed(2)
          // 显示跟随线框
          changeFollowBoxOpacity('1')
          // 动态改变宽高 实现跟随效果
          setFollowBoxWidthHeight(0, x1, y1)
          setFollowBoxWidthHeight(1, x2, y2)
          setFollowBoxWidthHeight(2, x3, y3)
          setFollowBoxWidthHeight(3, x4, y4)
        } else {
          state.locationShow.showX = 0
          state.locationShow.showY = 0
          // 隐藏跟随线框
          changeFollowBoxOpacity('0')
        }
      }
    }
    // 坐标点移动
    const markerMove = (x, y) => {
      x = (eventBoxWidth * (x / Store.productionLine.imageWidth)).toFixed(0)
      y = (eventBoxHeight * (y / Store.productionLine.imageHeight)).toFixed(0)
      document.getElementsByClassName('marker')[0].style.cssText =
        'left:' + (x - 8) + 'px;' + 'top:' + (y - 8) + 'px;'
      // 没有选点前保持隐藏
      document.getElementsByClassName('marker')[0].style.opacity = state.infoRef
        .deviceLocationX
        ? 1
        : 0
    }
    // 显示或隐藏 跟随线框
    const changeFollowBoxOpacity = val => {
      for (let i = 0; i < 4; i++) {
        document.getElementsByClassName('follow-box')[i].style.opacity = val
      }
    }
    // 动态改变宽高 实现跟随效果
    const setFollowBoxWidthHeight = (index, width, height) => {
      document.getElementsByClassName('follow-box')[index].style.cssText =
        'width:' + width + 'px;' + 'height:' + height + 'px;'
    }
    // 重置
    const reset = () => {
      // 取消监听
      document.removeEventListener('mousemove', updatePosition)
      // 清空fileList
      state.fileList = []
      // 还原默认值
      state.infoRef = source()
      state.locationShow.showX = 0
      state.locationShow.showY = 0
      // 关闭对话框
      ctx.emit('update:visible', false)
    }
    const state = reactive({
      infoRef: ref(source()),
      title: ref(''),
      isReady: ref(false),
      imgURL: ref(),
      dialogTop: ref(null),
      dialogFormVisible: ref(false),
      formLabel: [
        '设备名称',
        '设备描述',
        '设备大图',
        '设备区域中心',
        '超时时间',
      ],
      formInputPlaceholder: ['请输入设备名称', '请输入设备描述'],
      locationShow: {
        showX: 0,
        showY: 0,
      },
      dialogImageUrl: ref(''),
      dialogVisible: ref(false),
      fileList: ref([]),
      // 打开窗口时调用
      open: async () => {
        // 获取图片路径到窗口中
        state.imgURL = Store.productionLine.imagePath
        if (typeof props.operateRowId == 'number') {
          // 修改
          state.title = '修改设备信息'
          // 获取表单数据
          const { data } = await API.getEquipment(props.operateRowId)
          console.log('获取表单数据', data)
          state.infoRef = data
          state.isReady = true
          setTimeout(() => {
            // 有图的话显示出来
            if (data.deviceImagePath) {
              state.fileList.push({
                name: data.supplierDeviceName,
                url: CONSTANTS.BASE_URL + data.deviceImagePath,
              })
            }
            // 有选点的话显示出来
            if (data.deviceLocationX) {
              markerMove(data.deviceLocationX, data.deviceLocationY)
            }
          }, 100)
        } else {
          // 添加
          state.title = '添加设备'
          state.isReady = true
        }
        // 避免无法获取dom元素?
        setTimeout(() => {
          // 记录当前图片框的宽高
          eventBoxWidth = document.getElementsByClassName(
            'location-selector-box'
          )[0].offsetWidth
          eventBoxHeight = document.getElementsByClassName(
            'location-selector-box'
          )[0].offsetHeight
          // eventBoxWidth = eventBoxWidth2
          // eventBoxHeight = eventBoxHeight2
          // 添加鼠标移动的监听事件
          document.addEventListener('mousemove', updatePosition)
          // 计算窗口距离顶部的高度（因为图片的高是没有限制的）
          var dialogHeight = document.getElementById('dialog').offsetHeight
          var windowHeight =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight
          var realyTop = (windowHeight - dialogHeight) / 2
          state.dialogTop = (realyTop < 0 ? 50 : realyTop) + 'px'
        }, 10)
      },
      // 添加/修改设备
      confirm: async () => {
        if (typeof props.operateRowId != 'number') {
          await API.addEquipment(state.infoRef)
          ElMessage.success(CONSTANTS.TIP_ADD_SUCCESS)
        } else {
          await API.editEquipment(state.infoRef)
          ElMessage.success(CONSTANTS.TIP_EDIT_SUCCESS)
        }
        reset()
      },
      // 取消
      close: () => {
        reset()
      },
      // 判断鼠标位置
      changeMouseSelecting: () => {
        if (state.imgURL) {
          isMouseSelecting = !isMouseSelecting
        }
      },
      // 点击图片的钩子
      handleImageClick: event => {
        // 获取鼠标在div内的x、y
        const x = event.offsetX
        const y = event.offsetY

        // 计算并赋值 (相对于原尺寸)
        state.infoRef.deviceLocationX = (
          Store.productionLine.imageWidth *
          (x / eventBoxWidth)
        ).toFixed(2)
        state.infoRef.deviceLocationY = (
          Store.productionLine.imageHeight *
          (y / eventBoxHeight)
        ).toFixed(2)

        // 选点
        markerMove(state.infoRef.deviceLocationX, state.infoRef.deviceLocationY)
      },
      // 文件移除的钩子
      handleRemove: (uploadFile, uploadFiles) => {
        uploadFiles.splice(0, 1)
      },
      // 查看大图的钩子
      handlePictureCardPreview: uploadFile => {
        state.dialogImageUrl = uploadFile.url
        state.dialogVisible = true
      },
      // 处理多个文件上传的钩子
      handleExceed: uploadFile => {
        ElMessage.warning('不支持上传多张图片')
      },
      // 上传/修改设备图片
      doUpload: async (event, uploadFile, uploadFiles) => {
        var formData = new window.FormData()

        if (typeof props.operateRowId != 'number') {
          // 新增
          formData.append('supplierDeviceCode', '')
        } else {
          // 修改
          formData.append(
            'supplierDeviceCode',
            state.infoRef.supplierDeviceCode
          )
        }

        formData.append('file', uploadFile.raw)

        // 上传 得到服务器返回的url
        const { data } = await API.upload(formData)

        console.log('img', data)

        // 赋值给对象
        state.infoRef.deviceImagePath = data.imagePath
        state.infoRef.deviceImageWidth = data.imageWidth
        state.infoRef.deviceImageHeight = data.imageHeight

        // 回显到缩略图
        state.fileList.push({
          name: uploadFile.name,
          url: CONSTANTS.BASE_URL + data.imagePath,
        })

        ElMessage.success(CONSTANTS.TIP_UPLOAD_SUCCESS)
      },
    })
    // 监听父组件 打开窗口
    watch(
      () => props.visible,
      val => {
        state.dialogFormVisible = val
      }
    )
    // 监听输入值，使选点移动
    watch(
      [
        () => state.infoRef.deviceLocationX,
        () => state.infoRef.deviceLocationY,
      ],
      ([newProp1, newProp2], [oldProp1, oldProp2]) => {
        markerMove(newProp1, newProp2)
      }
    )
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 90%;
  margin: 0 5% !important;

  .el-dialog__body {
    flex-grow: 1 !important;
    padding: 0 2%;
  }
}

::v-deep .el-form-item {
  margin-bottom: 20px;
}

.form-box {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;

  .form-box_inner {
    position: relative;
    width: 100%;
    height: auto;

    display: flex;

    .form-box_inner_left {
      position: relative;
      width: 52%;

      .form-item:nth-child(2) {
        top: 20px;
      }
    }

    .form-box_inner_right {
      position: relative;
      left: 4%;
      width: 44%;

      .form-item:nth-child(1) {
        padding-right: 5%;
      }
    }

    .form-item {
      position: relative;
      display: flex;

      .form-item-label {
        position: relative;
        width: 20%;
      }
    }
  }
}

.location-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%; // 需设置el-form-item的行内样式
  height: auto;
  z-index: 0;
  overflow: hidden;

  .location-input {
    position: relative;
    margin-bottom: 50px;
    display: flex;
    width: 100%;

    flex-wrap: wrap;

    .location {
      position: relative;
      margin-right: 10px;
    }

    .timeout {
      position: relative;
      width: 45%;
      display: flex;
      left: 41px;

      .timeout-input {
        position: relative;
        left: 18px;
      }
    }
  }

  // 图片选点
  .location-selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 100%;
    height: auto;
    overflow: hidden;

    // 视觉修正
    left: -50px;

    .location-selector-box {
      position: relative;
      height: auto;
      // 很重要
      line-height: 0;

      // 图片自适应原始比例
      .location-selector_inner_img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }

      // 跟随框样式
      .follow-box {
        position: absolute;
        background-color: #ffffff5e;
      }

      .mouse-follow {
        left: 0px;
        top: 0px;
      }

      .mouse-follow2 {
        right: 0px;
        bottom: 0px;
      }

      .mouse-follow3 {
        right: 0px;
        top: 0px;

        // 实时显示的x、y
        .location-show {
          position: absolute;
          padding-left: 10px;
          color: black;
          width: 200px;
          height: 10px;
          bottom: 0;
          left: 0;
        }
      }

      .mouse-follow4 {
        left: 0px;
        bottom: 0px;
      }

      // 选点样式
      .marker {
        position: absolute;
        width: 10px;
        height: 10px;
        border: 3px dashed red;
        /* 根据选点位置设置样式 */
      }

      .block {
        position: relative;
        width: 1000px;
        margin-bottom: 20px;
        height: 300px;

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
    }
  }
}
</style>
