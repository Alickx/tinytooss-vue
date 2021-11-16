<template>
<div class="changeMain">
  <div class="changeStep">
    <el-steps :active=stepActive>
      <el-step title="Step 1" :status=step1Status description="请填写您的密码信息"></el-step>
      <el-step title="Step 2" :status=step2Status description="请查看修改结果"></el-step>
    </el-steps>
  </div>
  <div class="changeBox">
    <div class="changeForm" v-show="!showResult">
      <el-form :model="passwordChangeForm" ref="passwordChangeFormRef" :rules="rules">
        <el-form-item label="原密码" prop="accountPassword">
          <el-input type="password" v-model="passwordChangeForm.accountPassword" placeholder="原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newAccountPassword">
          <el-input type="password" v-model="passwordChangeForm.newAccountPassword" placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item label-width="auto">
          <el-button type="primary" @click="PostPasswordChange" style="width: 100%">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="changeResult" v-show="showResult">
      <el-result
          :icon=resultIcon
          :title=resultTitle
          :sub-title=resultSubTitle
      >
        <template #extra>
          <el-button type="primary" size="medium" v-if="!resultFlag" @click="goPreStep">上一步</el-button>
          <el-button type="primary" size="medium" v-if="resultFlag" @click="goLogin">重新登陆</el-button>
        </template>
      </el-result>
    </div>
  </div>
</div>
</template>

<script>
import {reactive, ref} from "vue";
import {passwordChange} from "@/assets/api";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import store from "@/store/store";

export default {
  name: "PasswordChange",
  setup(){

    let resultIcon = ref('');
    let resultTitle = ref('');
    let resultSubTitle = ref('')
    let showResult = ref(false);
    let stepActive = ref(1);
    let step1Status = ref('process');
    let step2Status = ref('wait');
    let resultFlag = ref(false);
    const passwordChangeFormRef = ref();

    const router = useRouter();

    const passwordChangeForm = reactive({
      accountPassword: '',
      newAccountPassword: ''
    })

    const rules = {
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
      ],
      newAccountPassword: [
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

    //导航去登陆界面
    const goLogin = ()=>{
      router.push('/login')
    }

    const goPreStep = ()=>{
      showResult.value = false;
      stepActive.value = 1;
      step1Status.value = 'process';
      step2Status.value = 'wait';
    }

    //发送修改密码请求
    const PostPasswordChange = ()=>{
      passwordChangeFormRef.value.validate().then(()=>{
        passwordChange(passwordChangeForm).then(resp =>{
          if (resp.code === 200) {
            resultIcon.value = 'success';
            resultTitle.value = '成功修改密码！'
            resultSubTitle.value = '请重新登陆！'
            showResult.value = true;
            step1Status.value = 'success';
            step2Status.value = 'success';
            stepActive.value = 2;
            store.commit('logOut');
            resultFlag.value = true;
          } else {
            resultIcon.value = 'error';
            resultTitle.value = '密码修改错误'
            resultSubTitle.value = resp.message
            showResult.value = true;
            stepActive.value = 2;
            step1Status.value = 'error';
            step2Status.value = 'error';
            resultFlag.value = false;
          }
        }).catch(()=>{
          ElMessage.error('密码修改错误，请联系管理员！');
        })
      }).catch(()=>{
        ElMessage.error("请正确填写信息!");
      })
    }

    return{
      passwordChangeForm,
      resultIcon,
      resultTitle,
      resultSubTitle,
      showResult,
      PostPasswordChange,
      stepActive,
      step1Status,
      step2Status,
      goLogin,
      goPreStep,
      resultFlag,
      rules,
      passwordChangeFormRef
    }
  }
}
</script>

<style scoped>

.changeMain{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.changeStep{
  width: 400px;
  margin-top: -20px;
}

.changeBox{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 300px;
  margin-top: 100px;
  border-radius: 20px;
}

.changeForm{
  width: 400px;
}

</style>