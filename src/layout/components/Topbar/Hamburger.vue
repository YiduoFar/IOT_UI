<!--
 *  ┌───┐   ┌───┬───┬───┬───┐ ┌───┬───┬───┬───┐ ┌───┬───┬───┬───┐ ┌───┬───┬───┐
 *  │Esc│   │ F1│ F2│ F3│ F4│ │ F5│ F6│ F7│ F8│ │ F9│F10│F11│F12│ │P/S│S L│P/B│  ┌┐    ┌┐    ┌┐
 *  └───┘   └───┴───┴───┴───┘ └───┴───┴───┴───┘ └───┴───┴───┴───┘ └───┴───┴───┘  └┘    └┘    └┘
 *  ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───────┐ ┌───┬───┬───┐ ┌───┬───┬───┬───┐
 *  │~ `│! 1│@ 2│# 3│$ 4│% 5│^ 6│& 7│* 8│( 9│) 0│_ -│+ =│ BacSp │ │Ins│Hom│PUp│ │N L│ / │ * │ - │
 *  ├───┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─────┤ ├───┼───┼───┤ ├───┼───┼───┼───┤
 *  │ Tab │ Q │ W │ E │ R │ T │ Y │ U │ I │ O │ P │{ [│} ]│ | \ │ │Del│End│PDn│ │ 7 │ 8 │ 9 │   │
 *  ├─────┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴┬──┴─────┤ └───┴───┴───┘ ├───┼───┼───┤ + │
 *  │ Caps │ A │ S │ D │ F │ G │ H │ J │ K │ L │: ;│" '│ Enter  │               │ 4 │ 5 │ 6 │   │
 *  ├──────┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴─┬─┴────────┤     ┌───┐     ├───┼───┼───┼───┤
 *  │ Shift  │ Z │ X │ C │ V │ B │ N │ M │< ,│> .│? /│  Shift   │     │ ↑ │     │ 1 │ 2 │ 3 │   │
 *  ├─────┬──┴─┬─┴──┬┴───┴───┴───┴───┴───┴──┬┴───┼───┴┬────┬────┤ ┌───┼───┼───┐ ├───┴───┼───┤ E││
 *  │ Ctrl│    │Alt │         Space         │ Alt│    │    │Ctrl│ │ ← │ ↓ │ → │ │   0   │ . │←─┘│
 *  └─────┴────┴────┴───────────────────────┴────┴────┴────┴────┘ └───┴───┴───┘ └───────┴───┴───┘
 * 
 * @Descripttion: 
 * @version: 
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-27 18:43:44
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 -->

<template>
  <!-- <el-icon
    :size="20"
    class="fold-btn"
    :class="{ collapse: collapse }"
    @click="handleToggleMenu"
  >
    <Fold />
  </el-icon> -->

  <!-- 自定义 -->
  <!-- <div class="hamburger-cycle-btn"> -->
  <el-icon
    :size="20"
    class="fold-btn"
    :class="{ collapse: collapse }"
    @click="handleToggleMenu"
  >
    <ArrowLeft />
  </el-icon>
  <!-- </div> -->
</template>
<script>
import { useApp } from '@/pinia/modules/app'
import { storeToRefs } from 'pinia'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const appStore = useApp()
    const { sidebar } = storeToRefs(appStore)
    const { setCollapse } = appStore
    const handleToggleMenu = () => {
      setCollapse(+!sidebar.value.collapse)
    }
    return {
      collapse: computed(() => sidebar.value.collapse),
      handleToggleMenu,
    }
  },
})
</script>
<style lang="scss" scoped>
// Date*2023-8-22 按钮跨边界显示：
// .hamburger-cycle-btn {
//   background-color: #fff;
//   border-radius: 50%;
//   box-shadow: 1px 1px 4px #73767a;
// }
// .nav中调整偏移，
// .right中注释掉overflow:auto，&.flex注释掉overflow:hidden，调整z-index为30
// .left中注释掉overflow:hidden，调整z-index为20
// 结果：失败，效果可以实现，但是因为左右板块的overflow改动，flex失效，右板块不能自适应屏幕

.fold-btn {
  line-height: 48px;
  padding: 5px;
  cursor: pointer;
  color: #73767a;

  &.collapse {
    transform: scale(-1, 1);
  }
}
</style>
