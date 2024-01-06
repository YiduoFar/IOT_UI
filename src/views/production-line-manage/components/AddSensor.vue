<template>
  <!-- 添加传感器 -->
  <el-dialog
    v-model="dialogFormVisible"
    id="dialog"
    title="添加传感器"
    @closed="close"
    @open="open"
    width="720px"
    :top="dialogTop"
    draggable
  >
    <!-- 骨架屏 -->
    <el-skeleton :rows="15" animated v-if="!isReady" />
    <!-- 表单 -->
    <el-form
      v-if="isReady"
      :model="infoRef"
      label-position="left"
      :inline="true"
      class="form-inline"
    >
      <!-- 传感器名称 -->
      <el-form-item :label="formLabel[0]" :label-width="95">
        <el-input
          type="text"
          v-model="infoRef.sensorName"
          :placeholder="formInputPlaceholder[0]"
          autocomplete="off"
          class="el-input-mr"
        />
      </el-form-item>
      <!-- 数据类型 -->
      <el-form-item :label="formLabel[1]" :label-width="95">
        <el-select v-model="infoRef.dataType" class="m-2" placeholder="Select">
          <el-option
            v-for="item in dataTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 数据单位 -->
      <el-form-item :label="formLabel[2]" :label-width="95">
        <el-select
          v-model="infoRef.dataUnit"
          class="m-2 el-input-mr"
          placeholder="Select"
        >
          <el-option
            v-for="item in dataUnitOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 扫描速率 -->
      <el-form-item :label="formLabel[3]" :label-width="95">
        <el-input
          type="text"
          v-model="infoRef.scanRate"
          :placeholder="formInputPlaceholder[1]"
        />
      </el-form-item>
      <!-- 传感器描述 -->
      <el-form-item :label="formLabel[5]" :label-width="95">
        <el-input
          type="textarea"
          resize="none"
          :rows="4"
          v-model="infoRef.sensorDescription"
          :placeholder="formInputPlaceholder[4]"
          autocomplete="off"
          style="width: 530px;"
        />
      </el-form-item>
      <!-- 报警规则 -->
      <el-form-item :label="formLabel[4]" :label-width="98">
        <div class="minMaxLabel">
          min
        </div>
        <el-input
          type="text"
          v-model="infoRef.dataMin"
          :placeholder="formInputPlaceholder[2]"
          autocomplete="off"
          style="width: 154px;margin-right: 20px;"
        />
        <div class="minMaxLabel">
          max
        </div>
        <el-input
          type="text"
          v-model="infoRef.dataMax"
          :placeholder="formInputPlaceholder[3]"
          autocomplete="off"
          style="width: 154px;"
        />
      </el-form-item>
      <!-- 传感器位置 -->
      <el-form-item
        :label="formLabel[6]"
        :label-width="110"
        style="position:relative;width: 100%;"
      >
        <div class="location-box ">
          <!-- X Y 输入框 -->
          <div class="location-input ">
            <div class="location">
              X
            </div>
            <el-input
              type="text"
              v-model="infoRef.sensorLocationX"
              :placeholder="locationShow.showX"
              autocomplete="off"
              style="width: 154px;margin-right: 39px;"
            />
            <div class="location">
              Y
            </div>
            <el-input
              type="text"
              v-model="infoRef.sensorLocationY"
              :placeholder="locationShow.showY"
              autocomplete="off"
              style="width: 154px;"
            />
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
                @mouseenter="changeMouseSelecting"
                @mouseleave="changeMouseSelecting"
              ></div>
            </div>
          </div>
        </div>
      </el-form-item>
      <!-- 是否脱敏 -->
      <el-form-item :label="formLabel[7]" :label-width="95">
        <el-radio-group v-model="infoRef.desensitization">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <template #footer v-if="isReady">
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, reactive, watch, toRefs, ref } from 'vue'
import { ElMessage } from 'element-plus'
import * as API from '@/api/equipment'
import useStore from '@/pinia/modules/store'
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
        dataMax: null, // 最大值 +++
        dataMin: null, // 最小值 +++
        dataType: 'int', // 数据类型 +++
        dataUnit: '℃', // 数据单位 +++
        delFlag: 0, // ---
        deviceCode: Store.equipment.code, // 所属设备编码 ###
        deviceName: Store.equipment.name, // 所属设备名称 ###
        id: null, // ---
        productLineCode: Store.equipment.productionLineCode, // 所属产线编码 ###
        productLineName: Store.equipment.productionLineName, // 所属产线名称 ###
        scanRate: null, // 扫描速率 +++
        sensorCode: '', // 传感器编码 ---
        sensorDescription: '', // 传感器描述 +++
        sensorLocationX: null, // +++ (调接口若无输入需改成0.0)
        sensorLocationY: null, // +++ (float类型)
        sensorName: '', // 传感器名称 +++
        sensorStatus: 1, // 传感器状态（-1异常，1正常）
        sensorType: '', // 传感器类型 ---
        supplierCode: 'supplier-abc', // 所属供应商编码 ###
        supplierName: Store.supplier.name, // 所属供应商名称 ###
        updateBy: '', // 更新者用户ID ###
        updateTime: null, // 更新时间（Date） ###
        desensitization: 0, // 是否脱敏（1：表示脱敏，0：表示未脱敏）
      }
    }
    // 监听鼠标移动
    const updatePosition = event => {
      const container = event.target.getBoundingClientRect()

      // 获取鼠标在div内的x、y
      const x = event.offsetX
      const y = event.offsetY

      const x1 = x - 5
      const y1 = y - 5

      const x2 = container.width - x - 5
      const y2 = container.height - y - 5

      const x3 = x2
      const y3 = y1

      const x4 = x1
      const y4 = y2

      // 废弃的功能，因为dialog的宽度改为了px，不会出现宽高改变的情况
      // 鼠标移动就更新选点图片窗口的宽高，应该有更好的解决方案
      // eventBoxWidth = document.getElementsByClassName('location-selector-box')[0].offsetWidth
      // eventBoxHeight = document.getElementsByClassName('location-selector-box')[0].offsetHeight
      // // 窗口变化时 选点位置不改变的保护措施
      // if (eventBoxWidth != eventBoxWidth2 || eventBoxHeight != eventBoxHeight2) {
      //     // 记录变化后的窗口宽高
      //     eventBoxWidth2 = eventBoxWidth
      //     eventBoxHeight2 = eventBoxHeight
      //     // 如果已经选点 由于窗口已经变化 请移动它
      //     if (state.infoRef.sensorLocationX) {
      //         markerMove(state.infoRef.sensorLocationX, state.infoRef.sensorLocationY)
      //     }
      // }

      // 当鼠标在图片中时的操作
      if (state.imgURL) {
        if (isMouseSelecting) {
          // 计算 并 实时显示真实的x、y
          state.locationShow.showX = (
            Store.equipment.imageWidth *
            (x / eventBoxWidth)
          ).toFixed(2)
          state.locationShow.showY = (
            Store.equipment.imageHeight *
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
      x = (eventBoxWidth * (x / Store.equipment.imageWidth)).toFixed(0)
      y = (eventBoxHeight * (y / Store.equipment.imageHeight)).toFixed(0)
      document.getElementsByClassName('marker')[0].style.cssText =
        'left:' + (x - 8) + 'px;' + 'top:' + (y - 8) + 'px;'
      // 没有选点前保持隐藏
      document.getElementsByClassName('marker')[0].style.opacity = state.infoRef
        .sensorLocationX
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
    function reset() {
      // 取消监听
      document.removeEventListener('mousemove', updatePosition)
      // 重置默认值
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
        '传感器名称',
        '数据类型',
        '数据单位',
        '扫描速率',
        '报警规则',
        '传感器详情',
        '传感器位置',
        '是否脱敏',
      ],
      formInputPlaceholder: [
        '请输入传感器名称',
        '请输入扫描速率',
        '请输入最小值',
        '请输入最大值',
        '请输入传感器详情',
      ],
      locationShow: {
        showX: 0,
        showY: 0,
      },
      dataTypeOptions: [
        {
          value: 'int',
          label: 'int',
        },
        {
          value: 'float',
          label: 'float',
        },
        {
          value: 'char',
          label: 'char',
        },
      ],
      dataUnitOptions: [
        {
          value: '℃',
          label: '℃',
        },
        {
          value: 'mA',
          label: 'mA',
        },
        {
          value: 'mB',
          label: 'mB',
        },
      ],
      // 打开窗口时调用
      open: async () => {
        // 获取图片路径到窗口中
        state.imgURL = Store.equipment.imagePath
        if (typeof props.operateRowId == 'number') {
          // 修改
          state.title = '修改传感器信息'
          // 获取表单数据
          const { data } = await API.getSensor(props.operateRowId)
          state.infoRef = data
          state.isReady = true
          setTimeout(() => {
            // 有选点的话显示出来
            if (data.sensorLocationX) {
              markerMove(data.sensorLocationX, data.sensorLocationY)
            }
          }, 100)
        } else {
          // 添加
          state.title = '添加传感器'
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
      // 添加/修改传感器
      confirm: async () => {
        if (typeof props.operateRowId != 'number') {
          await API.addSensor(state.infoRef)
          ElMessage.success(CONSTANTS.TIP_ADD_SUCCESS)
        } else {
          await API.editSensor(state.infoRef)
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
        const container = event.target.getBoundingClientRect()

        // 获取鼠标在div内的x、y
        const x = event.offsetX
        const y = event.offsetY
        // 计算并赋值 (相对于原尺寸)
        // state.infoRef.sensorLocationX = (Store.equipment.imageWidth * (x / eventBoxWidth)).toFixed(2);
        // state.infoRef.sensorLocationY = (Store.equipment.imageHeight * (y / eventBoxHeight)).toFixed(2);
        state.infoRef.sensorLocationX = (
          Store.equipment.imageWidth *
          (x / container.width)
        ).toFixed(2)
        state.infoRef.sensorLocationY = (
          Store.equipment.imageHeight *
          (y / container.height)
        ).toFixed(2)
        // 选点
        markerMove(state.infoRef.sensorLocationX, state.infoRef.sensorLocationY)
      },
    })
    // 监听父组件 打开窗口
    watch(
      [
        () => state.infoRef.sensorLocationX,
        () => state.infoRef.sensorLocationY,
      ],
      ([newProp1, newProp2], [oldProp1, oldProp2]) => {
        markerMove(newProp1, newProp2)
      }
    )
    // 监听输入值 选点移动
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
  margin-bottom: 20px;
}

// 输入框长度，特殊需在style行内样式修改
.form-inline .el-input {
  width: 200px;
}

.form-inline .el-select {
  width: 200px;
}

.el-input-mr {
  margin-right: 30px;
}

.minMaxLabel {
  margin-right: 10px;
}

.upload-img-item {
  position: absolute;
  top: 83px;
  margin-left: 50px;
}

.location-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%; // 需设置el-form-item的行内样式
  height: auto;

  .location-input {
    position: relative;
    margin-bottom: 35px;
    display: flex;

    .location {
      position: relative;
      margin-right: 10px;
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
        width: 700px;
        margin-bottom: 20px;
        height: 300px;

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
    }
  }
}
</style>
