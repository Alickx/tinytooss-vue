import axios from "axios";
import qs from "qs";
import {ElMessage} from "element-plus";
import store from '../store/store'

const service = axios.create({
  baseURL: "http://localhost:9451/api",
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});

service.interceptors.request.use(
  (config) => {
    let tokenName = store.getters.getTokenName;
    let tokenValue = store.getters.getTokenValue;
    if (tokenValue) {
      config.headers[tokenName] = tokenValue
      return config;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(response => {
  //接收到响应数据并成功后的一些共有的处理，关闭loading等
  if (response.status === 200) {
    return response.data;
  } else {
    Promise.reject();
  }
}, error => {
  /***** 接收到异常响应的处理开始 *****/
  if (error && error.response) {
    // 1.公共错误处理
    // 2.根据响应码具体处理
    switch (error.response.status) {
      case 400:
        ElMessage.error({
          message: '错误请求'
        })
        break;
      case 401:
        ElMessage.error({
          message: '未授权，请重新登录'
        })
        break;
      case 403:
        ElMessage.error({
          message: '拒绝访问'
        })
        break;
      case 404:
        ElMessage.error({
          message: '请求错误,未找到该资源'
        })
        //window.location.href = "/NotFound"
        break;
      case 405:
        ElMessage.error({
          message: '请求方法未允许'
        })
        break;
      case 408:
        ElMessage.error({
          message: '请求超时'
        })
        break;
      case 500:
        ElMessage.error({
          message: '服务器端出错'
        })
        break;
      case 501:
        ElMessage.error({
          message: '网络未实现'
        })
        break;
      case 502:
        ElMessage.error({
          message: '网络错误'
        })
        break;
      case 503:
        ElMessage.error({
          message: '服务不可用'
        })
        break;
      case 504:
        ElMessage.error({
          message: '网络超时'
        })
        break;
      case 505:
        ElMessage.error({
          message: 'http版本不支持该请求'
        })
        break;
      default:
        ElMessage.error({
          message: `连接错误${error.response.status}`
        })
    }
  } else {
    // 超时处理
    if (qs.stringify(error).includes('timeout')) {
      ElMessage.error({
        message: '服务器响应超时，请刷新当前页'
      })
    }
    ElMessage.error({
      message: '连接服务器失败'
    })
  }

  //Message.error(error.message)
  /***** 处理结束 *****/
  //如果不需要错误处理，以上的处理过程都可省略
  return Promise.resolve(error.response)
})

export default service;
