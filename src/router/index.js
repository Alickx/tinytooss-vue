import {createRouter, createWebHistory} from 'vue-router'
import store from "@/store/store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/pages/Index')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/About')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/Register')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/Login')
    },
    {
      path: '/user/oss',
      name: 'ossUpdate',
      component: ()=> import('@/pages/ossUpdate'),
      meta:{
        requiresAuth:true
      }
    },
    {
      path: '/user/password',
      name: 'passwordChange',
      component: ()=> import('@/pages/PasswordChange'),
      meta:{
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {

  //判断登陆后不能访问登陆注册页
  if (to.path === '/login' || to.path === '/register') {
    if (store.getters.getIsLogin) {
      next({
        path: '/index'
      })
    } else {
      next();
    }
  }
  //判断是否是登录保护路由
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //验证浏览器本地存储是否有token（或从vuex、Cookie、localStorage中获取，依据自己的存储），用于判断是否登录
    console.log(store.getters.getIsLogin)
    if (!store.getters.getIsLogin) {//没有token，表示未登录，则重定向到login
      next({
        //这里是你登录页面的路由名称，或直接使用 path:'/login'
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    // 确保一定要调用 next()
    next()
  }
})


// router.beforeEach((to, from, next) => {
//   //检查是否已经登陆
//   let isLogin = store.getters.getIsLogin
//   if (to.path === '/login' || to.path === '/register') {
//     if (isLogin === 'true') {
//       router.push('/index');
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// })

export default router