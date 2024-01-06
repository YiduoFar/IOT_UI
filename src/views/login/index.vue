<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-27 18:24:27
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
-->
<template>
  <div class="login">
    <div class="login-box">
      <el-form class="form" :model="model" :rules="rules" ref="loginForm">
        <!-- <h1 class="title">设备状态监测与分析</h1> -->
        <!-- <h1 class="title">IOT-System</h1> -->
        <h1 class="title">System</h1>
        <el-form-item prop="username">
          <el-input
            class="text"
            v-model="model.username"
            prefix-icon="User"
            clearable
            :placeholder="$t('login.username')"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            class="text"
            v-model="model.password"
            prefix-icon="Lock"
            show-password
            clearable
            :placeholder="$t('login.password')"
          />
        </el-form-item>
        <el-form-item
          style="display: flex; align-items: end; flex-direction: column"
        >
          <el-switch
            v-model="model.rememberMe"
            active-text="记住我"
            inactive-text=""
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="btn transition-250ms"
            size="large"
            @click="submit"
          >
            {{ btnText }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="to-reg">
        <div class="text1">还没有账号？</div>
        <div class="text2 transition-100ms" @click="changeShow(0)">去注册</div>
      </div>
    </div>

    <div class="reg-box">
      <el-form
        class="form"
        :model="model2"
        :rules="rules2"
        ref="regForm"
        :status-icon="true"
      >
        <h1 class="title">供应商注册</h1>
        <el-form-item prop="usernameR">
          <el-input
            class="text"
            v-model="model2.usernameR"
            prefix-icon="User"
            clearable
            :placeholder="$t('login.username')"
          />
        </el-form-item>
        <el-form-item prop="suppliercode">
          <el-input
            class="text"
            v-model="model2.suppliercode"
            prefix-icon="Postcard"
            clearable
            :placeholder="$t('login.suppliercode')"
          />
        </el-form-item>
        <el-form-item prop="passwordR">
          <el-input
            class="text reg-input"
            v-model="model2.passwordR"
            prefix-icon="Lock"
            show-password
            clearable
            :placeholder="$t('login.password')"
          />
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            class="text reg-input"
            v-model="model2.checkPass"
            prefix-icon="Lock"
            show-password
            clearable
            :placeholder="$t('login.checkPass')"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading2"
            type="primary"
            class="btn btn2 transition-250ms"
            size="large"
            @click="submit2"
          >
            {{ btnText2 }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="to-reg">
        <div class="text1">已注册账号，</div>
        <div class="text2 transition-100ms" @click="changeShow(1)">去登录</div>
      </div>
    </div>
  </div>
  <div class="change-lang">
    <change-lang />
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  computed,
  watch,
} from 'vue'
import * as API from '@/api/login'
import { useRouter, useRoute } from 'vue-router'
// import ChangeLang from '@/layout/components/Topbar/ChangeLang.vue'
import useLang from '@/i18n/useLang'
import { useApp } from '@/pinia/modules/app'
import { ElMessage } from 'element-plus'

import CONSTANTS from '@/utils/constants'
import { useAccount } from '@/pinia/modules/account'

export default defineComponent({
  // components: { ChangeLang },
  name: 'login',
  setup() {
    const { proxy: ctx } = getCurrentInstance() // 可以把ctx当成vue2中的this
    const router = useRouter()
    const route = useRoute()
    const { lang } = useLang()
    watch(lang, () => {
      state.rules = getRules()
      state.rules2 = getRules2()
    })
    const getRules = () => ({
      username: [
        {
          required: true,
          message: ctx.$t('login.rules-username'),
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: ctx.$t('login.rules-password'),
          trigger: 'blur',
        },
        {
          min: 6,
          max: 12,
          message: ctx.$t('login.rules-regpassword'),
          trigger: 'blur',
        },
      ],
    })
    const getRules2 = () => ({
      usernameR: [
        {
          required: true,
          message: ctx.$t('login.rules-username'),
          trigger: 'blur',
        },
      ],
      suppliercode: [
        {
          required: true,
          message: ctx.$t('login.rules-suppliercode'),
          trigger: 'blur',
        },
      ],
      passwordR: [
        {
          required: true,
          message: ctx.$t('login.rules-password'),
          trigger: 'blur',
        },
        {
          min: 6,
          max: 12,
          message: ctx.$t('login.rules-regpassword'),
          trigger: 'blur',
        },
      ],
      checkPass: [
        {
          required: true,
          message: ctx.$t('login.rules-checkPass'),
          trigger: 'blur',
        },
      ],
    })
    const state = reactive({
      show: true,
      model: {
        username: 'test',
        password: '123456',
        rememberMe: true,
      },
      // usernameR: '',
      // passwordR: '',
      model2: {
        usernameR: '',
        suppliercode: '',
        passwordR: '',
        checkPass: '',
      },
      rules: getRules(),
      rules2: getRules2(),
      loading: false,
      loading2: false,
      btnText: computed(() =>
        state.loading ? ctx.$t('login.logining') : ctx.$t('login.login')
      ),
      btnText2: computed(() =>
        state.loading2 ? ctx.$t('login.reging') : ctx.$t('login.reg')
      ),
      loginForm: ref(null),
      regForm: ref(null),
      submit: () => {
        if (state.loading) {
          return
        }
        state.loginForm.validate(async valid => {
          if (valid) {
            state.loading = true
            // const { code, data, message } = await API.LoginMOCK(state.model)
            const { code, data, message } = await API.Login(state.model)
            // if (+code === 200) {
            if (+code === 10000) {
              console.log('登录：', data)

              ctx.$message.success({
                message: ctx.$t('login.loginsuccess'),
                duration: 1000,
              })

              const targetPath = decodeURIComponent(route.query.redirect)
              if (targetPath.startsWith('http')) {
                // 如果是一个url地址
                window.location.href = targetPath
              } else if (targetPath.startsWith('/')) {
                // 如果是内部路由地址
                router.push(targetPath)
              } else {
                router.push('/')
              }
              // useApp().initToken(data)
              useApp().initToken({
                token: data.token,
              })
              useAccount().setUserinfo({
                user: data.user,
              })
              // console.log(useAccount().userinfo)
            } else {
              ctx.$message.error(message)
            }
            state.loading = false
          }
        })
      },
      submit2: async () => {
        if (state.loading2) {
          return
        }
        state.regForm.validate(async valid => {
          // 后端没有检查密码，只能在这写
          if (state.model2.passwordR != state.model2.checkPass) {
            ElMessage.error(CONSTANTS.TIP_REG_2PASS_ERROR)
            return
          }
          // 注册
          if (valid) {
            state.loading2 = true
            var obj = {
              username: state.model2.usernameR,
              suppliercode: state.model2.suppliercode,
              password: state.model2.passwordR,
              checkPass: state.model2.checkPass,
            }
            const { code, message, data } = await API.Reg(obj)
            if (code === 10000) {
              ElMessage.success(CONSTANTS.TIP_REG_SUCCESS)

              state.regForm.resetFields()

              setTimeout(() => {
                location.reload()
              }, 1000)
            } else {
              ElMessage.error(message)
            }
            state.loading2 = false
          }
        })
      },
    })

    const changeShow = box => {
      var ri0 = document.getElementsByClassName('reg-input')[0].style
      var ri1 = document.getElementsByClassName('reg-input')[1].style

      var lb0 = document.getElementsByClassName('login-box')[0].style
      var rb0 = document.getElementsByClassName('reg-box')[0].style

      var btn = document.getElementsByClassName('btn')[0].style
      var btn1 = document.getElementsByClassName('btn')[1].style

      var text = document.getElementsByClassName('to-reg')[0].style
      var text1 = document.getElementsByClassName('to-reg')[1].style

      if (box === 0) {
        state.loginForm.resetFields()
        // 显示
        rb0.opacity = '1'
        // 隐藏
        text.opacity = '0'
        text1.opacity = '0'
        ri0.opacity = '0'
        ri1.opacity = '0'
        btn.opacity = '0'
        document.getElementsByClassName('btn')[0].disabled = true
        document.getElementsByClassName('btn')[1].disabled = false
        btn1.opacity = '0'
        // 缩小
        lb0.width = '22%'
        lb0.height = '22%'
        lb0.top = '35%'
        rb0.width = '22%'
        rb0.height = '22%'
        rb0.top = '35%'

        // setTimeout(() => {
        // 移动
        lb0.left = '8%'
        rb0.left = '35%'
        // setTimeout(() => {
        lb0.opacity = '0'
        // 放大
        rb0.width = '25%'
        rb0.height = 'auto'
        rb0.top = '26%'

        ri0.opacity = '1'
        ri1.opacity = '1'
        btn1.opacity = '1'
        setTimeout(() => {
          text.opacity = '0'
          text1.opacity = '1'
        }, 100)
        // }, 500)
        // }, 800)
      } else {
        state.regForm.resetFields()
        document.getElementsByClassName('btn')[0].disabled = false
        document.getElementsByClassName('btn')[1].disabled = true
        // 显示
        lb0.opacity = '1'
        // 隐藏
        text.opacity = '0'
        text1.opacity = '0'
        ri0.opacity = '0'
        ri1.opacity = '0'
        btn.opacity = '0'
        btn1.opacity = '0'
        // 缩小
        lb0.width = '22%'
        lb0.height = '22%'
        lb0.top = '35%'
        rb0.width = '22%'
        rb0.height = '22%'
        rb0.top = '35%'

        // setTimeout(() => {
        // 移动
        lb0.left = '35%'
        rb0.left = '62%'
        // setTimeout(() => {
        rb0.opacity = '0'
        btn.opacity = '1'
        // 放大
        lb0.width = '25%'
        lb0.height = 'auto'
        lb0.top = '30%'
        setTimeout(() => {
          text.opacity = '1'
          text1.opacity = '0'
          // rb0.left = '62%'
        }, 100)
        // }, 500)
        // }, 800)
      }
    }

    return {
      ...toRefs(state),
      changeShow,
    }
  },
})
</script>

<style lang="scss" scoped>
.login {
  transition: transform 1s;
  transform: scale(1);
  width: 100%;
  height: 100%;
  overflow: hidden;
  // background: #2d3a4b;
  background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);

  // position: relative;
  display: flex;

  .login-box,
  .reg-box {
    // position: relative;
    // width: 25%;
    height: auto;
    // left: 35%;
    // top: 30%;
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.849);
    box-shadow: 5px 5px 20px rgba(160, 160, 160, 0.527);
    border-radius: 10px;

    transition: all 0.5s ease-in-out;
  }

  .login-box {
    opacity: 1;
    position: absolute;
    width: 25%;
    left: 35%;
    top: 30%;
  }

  .reg-box {
    opacity: 0;
    position: absolute;
    width: 25%;
    left: 62%;
    top: 30%;
  }

  .to-reg {
    position: absolute;
    bottom: -30px;
    right: 30px;
    display: flex;

    .text1 {
      color: #9b9b9b;
    }

    .text2 {
      cursor: pointer;
      color: #4ea7ff;
    }

    .text2:hover {
      color: #1e8eff;
    }
  }

  .form {
    width: 100%;
    box-sizing: border-box;

    :deep {
      .el-input__wrapper {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.808) inset;
        background: rgba(189, 189, 189, 0.1);
      }

      .el-input-group--append > .el-input__wrapper {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .el-input-group--prepend > .el-input__wrapper {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    .title {
      // color: #fff;
      text-align: center;
      font-size: 24px;
      margin: 0 0 10%;
    }

    .text {
      font-size: 16px;
      width: 100%;

      :deep(.el-input__inner) {
        color: #444444;
        height: 40px;
        line-height: 48px;

        &::placeholder {
          color: rgba(165, 165, 165, 0.911);
        }
      }
    }

    .btn {
      width: 100%;
    }

    .btn2 {
      margin-top: 30px;
    }
  }
}

.change-lang {
  position: fixed;
  right: 20px;
  top: 20px;

  :deep {
    .change-lang {
      height: 24px;

      &:hover {
        background: none;
      }

      .icon {
        color: #fff;
      }
    }
  }
}
</style>
