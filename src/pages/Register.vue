<template>
  <div class="registerBox">
    <div class="registerInfo">
      <span>加入我们</span>
      <p>感受科技的魅力</p>
    </div>
    <div class="registerForm">
      <el-form class="registerInput" ref="registerFormRef" :model="registerForm" label-width="auto" :rules="rules">
        <el-form-item label="账号" prop="accountName">
          <el-tooltip
            effect="dark"
            content="字母开头，允许5-16字节，允许字母数字下划线"
            placement="right"
        >
          <el-input v-model="registerForm.accountName"></el-input>
        </el-tooltip>
        </el-form-item>
        <el-form-item label="密码" prop="accountPassword">
          <el-tooltip
            effect="dark"
            content="以字母开头，长度在6~18之间，只能包含字母、数字和下划线"
            placement="right"
          >
          <el-input v-model="registerForm.accountPassword" type="password"></el-input>
          </el-tooltip>
        </el-form-item>
        <div style="margin-top: 30px">
          <el-button style="width: 100%;" type="primary" @click="registerPost">注册</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>


<script>
import {reactive, ref} from "vue";
import {userRegister} from "@/assets/api";
import {ElMessage} from "element-plus";
import index from "@/assets/config";
import router from "@/router";

export default {
  name: "Register",
  setup() {

    const registerFormRef = ref();

    const registerForm = reactive({
      accountName: '',
      accountPassword: '',
      ticket: '',
      randstr: ''
    });

    const rules = {
      accountName:[
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
      accountPassword:[
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

    const registerPost = () => {
      registerFormRef.value.validate().then(()=> {
        let captcha = new window.TencentCaptcha(index.app_id, (res) => {

          registerForm.ticket = res.ticket;
          registerForm.randstr = res.randstr;

          userRegister(registerForm).then(resp => {
            if (resp.code === 200) {
              ElMessage.success({
                message: '用户注册成功！'
              })
              setTimeout(()=>{
                router.push('/login')
              },1200)
            } else {
              ElMessage.error({
                message: resp.message
              })
            }
          }).catch(() => {
            ElMessage.error({
              message: '系统发生错误！请稍后重试！'
            })
          })
        })
        captcha.show();
      }).catch(()=>{
        ElMessage.error("请正确填写注册信息!");
        return false;
      })
    }


    return {
      registerForm,
      registerPost,
      rules,
      registerFormRef
    }

  }
}
</script>

<style scoped>

.registerForm {
  margin-top: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.registerBox {
  width: 500px;
  height: 500px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);
}

.registerInfo {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100px;
  background: #0e88eb;
  padding-top: 20px;
}

.registerInput{
  padding: 40px;
  width: 100%;
}


.registerInfo span {
  font-size: 28px;
  color: white;
}

.registerInfo p {
  font-size: 15px;
  color: white;
}

</style>