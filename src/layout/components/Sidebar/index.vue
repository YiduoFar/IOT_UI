<!--
 *                                                     __----~~~~~~~~~~~------___
 *                                    .  .   ~~//====......          __--~ ~~
 *                    -.            \_|//     |||\\  ~~~~~~::::... /~
 *                 ___-==_       _-~o~  \/    |||  \\            _/~~-
 *         __---~~~.==~||\=_    -_--~/_-~|-   |\\   \\        _/~
 *     _-~~     .=~    |  \\-_    '-~7  /-   /  ||    \      /
 *   .~       .~       |   \\ -_    /  /-   /   ||      \   /
 *  /  ____  /         |     \\ ~-_/  /|- _/   .||       \ /
 *  |~~    ~~|--~~~~--_ \     ~==-/   | \~--===~~        .\
 *           '         ~-|      /|    |-~\~~       __--~~
 *                       |-~~-_/ |    |   ~\_   _-~            /\
 *                            /  \     \__   \/~                \__
 *                        _--~ _/ | .-~~____--~-/                  ~~==.
 *                       ((->/~   '.|||' -_|    ~~-/ ,              . _||
 *                                  -_     ~\      ~~---l__i__i__i--~~_/
 *                                  _-~-__   ~)  \--______________--~~
 *                                //.-~~~-~_--~- |-------~~~~~~~~
 *                                       //.-~~~--\
 *                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *                               神兽保佑            永无BUG
 * 
 * @Descripttion: 
 * @version: 
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-27 18:45:07
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 -->

<template>
  <div
    class="left"
    :class="{ collapse: collapse, mobile: device === 'mobile' }"
  >
    <!-- <logo /> -->
    <menus :collapse="collapse" />
  </div>
  <div class="mask" @click="closeSidebar"></div>
  <!-- 自定义增加的折叠按钮 -->
  <el-icon class="fold-btn" :class="{ co: co }" @click="handleToggleMenu">
    <ArrowLeft />
  </el-icon>
</template>

<script>
import { useApp } from '@/pinia/modules/app'
import { storeToRefs } from 'pinia'
import { computed, defineComponent } from 'vue'
// import Logo from './Logo.vue'
import Menus from './Menus.vue'

export default defineComponent({
  components: {
    // Logo,
    Menus,
  },
  setup() {
    const appStore = useApp()
    const { sidebar, device } = storeToRefs(appStore)
    const { setCollapse } = appStore
    const collapse = computed(() => sidebar.value.collapse)

    const closeSidebar = () => {
      setCollapse(1)
    }

    const handleToggleMenu = () => {
      setCollapse(+!sidebar.value.collapse)
    }

    return {
      collapse,
      device,
      closeSidebar,
      co: computed(() => sidebar.value.collapse),
      handleToggleMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
.left {
  width: 150px;
  // width: 210px;
  background: $menuBg;
  background-image: $mainGradation;
  transition: all 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  // 自定义
  // z-index: 20;
  border-right: 3px solid $mainLine;

  &.collapse {
    width: 64px;

    ::v-deep(.brand .title) {
      display: none;
    }
  }

  &.mobile {
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;

    & + .mask {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 9;
    }

    &.collapse {
      transform: translateX(-100%);

      & + .mask {
        display: none;
      }
    }
  }
}
.fold-btn {
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 2px 2px 10px #77777759;
  cursor: pointer;
  position: relative;
  left: -16px;
  top: 13px;
  height: 30px;
  width: 30px;
  z-index: 20;
  &.co {
    transform: scale(-1, 1);
  }
}
</style>
