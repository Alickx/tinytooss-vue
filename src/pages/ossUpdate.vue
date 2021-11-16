<template>
  <div class="updateMain">
    <div class="ossUpdateTip">
      <el-card shadow="hover" body-style="letter-spacing: 1px;">
        <div style="text-align: center">
          <h2>Tip: </h2>
        </div>
        <hr>
        <div>
          <span>
            请注意，请勿使用主账号的AccessKey，具体可以用阿里云子账号AccessKey，请只给子账号授权oss读写权限。
          </span>
        </div>
        <div>
          <span>
          如若因为在本站使用主账号AccessKey而导致的财产损失，本站均不负责。
          </span>
        </div>
      </el-card>
    </div>
    <div class="ossUpdateBox">
      <div class="ossUpdateForm">
        <el-form label-width="auto" :model="AliOssForm">
          <el-form-item label="AccessId">
            <el-input type="text" v-model="AliOssForm.accessId" placeholder="请输入您的阿里云AccessId"></el-input>
          </el-form-item>
          <el-form-item label="AccessKey">
            <el-input type="password" v-model="AliOssForm.accessKey" placeholder="请输入您的阿里云AccessId"></el-input>
          </el-form-item>
          <el-form-item label="Endpoint">
            <el-input type="text" v-model="AliOssForm.endpoint" placeholder="请输入您的阿里云OssEndpoint"></el-input>
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input type="text" v-model="AliOssForm.bucket" placeholder="请输入您的阿里云OssBucket"></el-input>
          </el-form-item>
          <el-form-item label="Dir">
            <el-input type="text" v-model="AliOssForm.dir" placeholder="请输入您要保存的路径"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" type="primary" @click="ossUpdateClick">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";
import {getUserOssInfo, ossUpdate} from "@/assets/api";
import {ElMessage} from "element-plus";

export default {
  name: "ossUpdate",
  setup() {

    const AliOssForm = reactive({
      accessId: '',
      accessKey: '',
      endpoint: '',
      bucket: '',
      dir: ''
    })

    const ossUpdateClick = () => {

      ossUpdate(AliOssForm).then(resp => {
        if (resp.code === 200) {
          ElMessage.success('阿里云Oss更新成功！')
        } else {
          ElMessage.error(resp.message)
        }
      })

    }

    onMounted(() => {

      getUserOssInfo().then(resp => {

        if (resp.code === 200) {
          AliOssForm.accessId = resp.data.accessId;
          AliOssForm.accessKey = resp.data.accessId;
          AliOssForm.endpoint = resp.data.endpoint;
          AliOssForm.bucket = resp.data.bucket;
          AliOssForm.dir = resp.data.dir;
          ElMessage.success('用户阿里云oss信息获取成功!')
        } else {
          ElMessage.error(resp.message)
        }
      }).catch(() => {
        ElMessage.error('用户阿里云oss信息获取失败!')
      })

    })

    return {
      AliOssForm,
      ossUpdateClick
    }

  }
}
</script>

<style scoped>

.updateMain {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

}

.ossUpdateTip {
  margin-top: -30px;
}

.ossUpdateBox {
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);;
  margin-top: 50px;
}

.ossUpdateForm {
  width: 400px;
}

</style>