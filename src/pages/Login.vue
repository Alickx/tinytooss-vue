<template>
  <div class="loginBox">
    <div class="loginInfo">
      <span>登陆</span>
      <p>开始您的表演</p>
    </div>
    <div class="loginForm">
      <el-form class="loginInput" ref="loginFormRef" :model="loginForm" label-width="auto" :rules="rules">
        <el-form-item label="账号" prop="accountName">
          <el-input v-model="loginForm.accountName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="accountPassword">
          <el-input v-model="loginForm.accountPassword" type="password"></el-input>
        </el-form-item>
        <div style="margin-top: 30px">
          <el-button style="width: 100%" type="primary" @click="loginPost">登陆</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from "vue";
import config from "@/assets/config";
import {userLogin} from "@/assets/api";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

export default {
  name: "Login",
  setup() {
    const loginForm = reactive({
      accountName: '',
      accountPassword: '',
      ticket: '',
      randstr: ''
    })

    const loginFormRef = ref();

    const store = useStore();

    const router = useRouter();


    const loginPost = () => {
      loginFormRef.value.validate().then(() => {
        let captcha = new window.TencentCaptcha(config.app_id, res => {
          loginForm.randstr = res.randstr;
          loginForm.ticket = res.ticket;

          userLogin(loginForm).then(resp => {

            if (resp.code === 200) {

              //将tokenInfo存入vuex
              store.commit('setTokenName', resp.data.tokenName);
              store.commit('setTokenValue', resp.data.tokenValue);
              store.commit('setIsLogin', resp.data.isLogin);

              ElMessage.success({
                message: '用户登陆成功！'
              })
              router.push('/index')
            } else {
              ElMessage.error({
                message: resp.message
              })
            }
          }).catch(() => {
            ElMessage.error({
              message: '登陆错误！系统发生错误，请稍后重试！'
            })
          })
        })
        captcha.show();
      }).catch(()=>{
        ElMessage.error("请正确填写登录信息！")
      })
    }

    const rules = {
      accountName: [
        {
          required: true,
          message: '账号不能为空，请输入账号!',
          trigger: 'blur'
        },
        {
          pattern: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/,
          message: '字母开头，允许5-16字节，允许字母数字下划线',
          trigger: 'blur'
        }
      ],
      accountPassword: [
        {
          required: true,
          message: '密码不能为空，请输入密码!',
          trigger: 'blur'
        },
        {
          pattern: /^[a-zA-Z]\w{5,17}$/,
          message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线',
          trigger: 'blur'
        }
      ]
    }

    return {
      loginPost,
      loginForm,
      rules,
      loginFormRef
    }

  }
}
</script>

<style scoped>

.loginForm {
  margin-top: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.loginBox {
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);
}

.loginInfo {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100px;
  background: #0e88eb;
  padding-top: 20px;
}

.loginInput {
  padding: 40px;
  width: 100%;
}

.loginInfo span {
  font-size: 28px;
  color: white;
}

.loginInfo p {
  font-size: 15px;
  color: white;
}

</style>