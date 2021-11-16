import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'
import router from './router/index'
import '@/assets/icons/iconfont.css'
import store from './store/store'

const app = createApp(App);
app.config.globalProperties.$http = axios
app.use(ElementPlus)
app.use(store)
app.use(router)
app.mount('#app')
