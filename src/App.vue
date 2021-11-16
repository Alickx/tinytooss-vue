<template>
  <div class="layout">
    <el-container>
      <el-header>
        <div class="head">
          <div class="logo">
            <img src="./assets/logo.png" alt="logo" width="50" height="50">
            <span>TinyPNGToOss</span>
          </div>
          <el-menu
              :default-active="activeIndex"
              mode="horizontal"
              class="menu-items"
              :ellipsis="false"
              :router="true"
          >
            <el-menu-item index="/index"><span>主页</span></el-menu-item>
            <el-menu-item index="/register" v-if="isLogin === false"><span>注册</span></el-menu-item>
            <el-menu-item index="/login" v-if="isLogin ===false"><span>登陆</span></el-menu-item>
            <el-sub-menu v-if="isLogin">
                <template #title>个人中心</template>
<!--                <el-menu-item index="">密码修改</el-menu-item>-->
                <el-menu-item index="/user/oss">阿里云Oss设置</el-menu-item>
                <el-menu-item index="/user/password">修改密码</el-menu-item>
            </el-sub-menu>
            <el-menu-item @click="logout" index="#" v-if="isLogin"><span>注销</span></el-menu-item>
          </el-menu>
        </div>
      </el-header>
      <el-main>
        <div class="main">
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>

import {onMounted, ref, watch} from "vue";
import {userIsLogin, userLogout} from "@/assets/api/index";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";
import {useRouter} from "vue-router";


export default {
  name: 'App',
  setup() {
    const activeIndex = ref('1');
    const store = useStore();
    let isLogin = ref(store.getters.getIsLogin);

    const router = useRouter();


    const logout = () => {
      userLogout().then(resp => {
        if (resp.code === 200) {
          store.commit('logOut');
          ElMessage.success('用户注销成功！');
          setTimeout(()=>{
            router.push('/index')
          })
        } else {
          ElMessage.error(resp.message);
        }
      }).catch(() => {
        ElMessage.error('系统发生错误！请稍后重试！');
      })
    }

    watch(()=> store.state.isLogin,()=>{
      isLogin.value = store.getters.getIsLogin;
    })


    onMounted(()=>{
      //发送请求
      userIsLogin().then(resp =>{
        if (resp.data.isLogin===false){
          store.commit('logOut');
        }
      }).catch(() =>{
        ElMessage.error("发生了一个小小错误");
      })

    })

    return {
      activeIndex,
      logout,
      isLogin
    }
  }
}
</script>

<style>

.el-header {
  padding: 0 !important;
}

.layout {
  min-height: 100vh;
}

.head {
  display: flex;
  align-items: center;
  height: 90px;
  background: rgba(255, 255, 255, 0.8);
  -webkit-box-shadow: 0 5px 6px -5px rgb(133 133 133 / 60%);
  box-shadow: 0 5px 6px -5px rgb(133 133 133 / 60%);
  font-size: 16px;
}

.head > div {
  display: flex;
  align-items: center;
}

.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.logo {
  margin-left: 50px;
}

.menu-items {
  margin-left: 30px !important;
}

.menu-items span {
  font-size: 16px;
}

.main {

  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  width: 100%;
}

.footer {

  display: flex;
  justify-content: center;
  align-items: center;

}


</style>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

a {
  text-decoration: none;
}

li {
  list-style: none;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
}
</style>
