<!--
 * _______________#########_______________________ 
 * ______________############_____________________ 
 * ______________#############____________________ 
 * _____________##__###########___________________ 
 * ____________###__######_#####__________________ 
 * ____________###_#######___####_________________ 
 * ___________###__##########_####________________ 
 * __________####__###########_####_______________ 
 * ________#####___###########__#####_____________ 
 * _______######___###_########___#####___________ 
 * _______#####___###___########___######_________ 
 * ______######___###__###########___######_______ 
 * _____######___####_##############__######______ 
 * ____#######__#####################_#######_____ 
 * ____#######__##############################____ 
 * ___#######__######_#################_#######___ 
 * ___#######__######_######_#########___######___ 
 * ___#######____##__######___######_____######___ 
 * ___#######________######____#####_____#####____ 
 * ____######________#####_____#####_____####_____ 
 * _____#####________####______#####_____###______ 
 * ______#####______;###________###______#________ 
 * ________##_______####________####______________ 
 * 
 * @Descripttion: 
 * @version: 
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-27 18:31:47
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 -->

<template>
  <!-- 自定义增加的Top -->
  <div class="over-wrapper">
    <!-- logo -->
    <logo />
    <!--  -->
    <div class="action">
      <el-icon class="questions-icon">
        <QuestionFilled />
      </el-icon>
      <!-- 暗黑模式 -->
      <!-- <img v-if="darkMode" src="@/assets/svg/night.svg" class="dark-icon" @click="changeDark">
      <img v-if="!darkMode" src="@/assets/svg/sunny.svg" class="dark-icon" @click="changeDark"> -->
      <!-- <error-log /> -->
      <userinfo />
      <!-- <change-lang /> -->
    </div>
  </div>
  <!-- <div class="gradation-line-up-to-down"></div> -->
  <!-- 脚手架自带的wrappper -->
  <div class="wrapper" :class="{ fluid: isFluid }">
    <sidebar v-if="isMenusShow && !isHorizontalMenu" />
    <div class="right" :class="{ flex: isTopbarFixed }">
      <div class="top">
        <topbar />
        <menus mode="horizontal" v-if="isMenusShow && isHorizontalMenu" />
        <!-- <tagsbar /> -->
        <breadcrumbs
          v-if="isBreadcrumbsShow"
          @on-breadcrumbs-change="handleBreadcrumbsChange"
        />
      </div>
      <div class="main" :class="{ pt0: isBreadcrumbsShow && paddingFlag }">
        <Content />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from 'vue'
import Sidebar from './components/Sidebar/index.vue'
import Topbar from './components/Topbar/index.vue'
import Menus from './components/Sidebar/Menus.vue'
// import Tagsbar from './components/Tagsbar/index.vue'
import Breadcrumbs from './components/Topbar/Breadcrumbs.vue'
import Content from './components/Content/index.vue'
import { useResizeHandler } from './hooks/useResizeHandler'
import { storeToRefs } from 'pinia'
import { useLayoutsettings } from '@/pinia/modules/layoutSettings'

import Userinfo from './components/Topbar/Userinfo.vue'
// import ChangeLang from './components/Topbar/ChangeLang.vue'
// import ErrorLog from '@/components/ErrorLog/index.vue'

// 热更新失效可能因为引入文件时没有注意大小写
import Logo from './components/HeadBar/Logo.vue'

export default defineComponent({
  name: 'layout',
  components: {
    Sidebar,
    Topbar,
    Menus,
    // Tagsbar,
    Breadcrumbs,
    Content,

    Userinfo,
    // ChangeLang,
    // ErrorLog,

    Logo,
  },
  setup() {
    useResizeHandler()
    const defaultSettings = useLayoutsettings()
    const isFluid = defaultSettings.layout.isFluid
    const isTopbarFixed = defaultSettings.topbar.isFixed
    const isMenusShow = defaultSettings.menus.isShow
    const isHorizontalMenu = defaultSettings.menus.mode === 'horizontal'
    const isBreadcrumbsShow = computed(
      () => isHorizontalMenu && defaultSettings.breadcrumbs.isShow
    )
    const paddingFlag = ref(true)
    const handleBreadcrumbsChange = boo => {
      paddingFlag.value = boo
    }

    const darkMode = ref(true)

    const changeDark = () => {
      darkMode.value = !darkMode.value
      document.getElementsByTagName('html')[0].classList.toggle('dark')
    }

    return {
      isFluid,
      isTopbarFixed,
      isMenusShow,
      isHorizontalMenu,
      isBreadcrumbsShow,
      paddingFlag,
      handleBreadcrumbsChange,
      changeDark,
      darkMode,
    }
  },
})
</script>

<style lang="scss" scoped>
.over-wrapper {
  position: relative;
  display: flex;
  // height: 6.5%;
  height: 60px;
  border-bottom: 2px solid $mainLine;
  background-color: $mainBg;

  .action {
    position: absolute;
    right: 0;
    padding: 7px;
    display: flex;
    align-items: center;

    .questions-icon {
      font-size: 20px;
      margin-right: 10px;
      color: $mainColor;
      cursor: pointer;
    }

    .dark-icon {
      cursor: pointer;
      width: 30px;
      height: 30px;
    }
  }
}

.wrapper {
  display: flex;
  margin: 0 auto;
  width: 1440px;
  height: 93.5%;
  background-color: $mainBg;
  background-image: $mainGradation;

  &.fluid {
    width: 100%;
  }

  .right {
    flex: 1;
    overflow: auto;

    // 自定义
    // z-index: 30;

    &.flex {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .top {
      background: #fff;
    }

    .main {
      flex: 1;
      background: $mainBg;
      background-image: $mainGradation;
      padding: 16px;
      overflow: auto;

      &.pt0 {
        padding-top: 0;
      }
    }
  }
}
</style>
