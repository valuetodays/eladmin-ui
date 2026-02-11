import axios from 'axios'
import router from '@/router/routers'
import { Notification } from 'element-ui'
import store from '../store'
import { getToken, setToken, removeToken } from '@/utils/auth'
import Config from '@/settings'
import Cookies from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout, // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json'
    // 全部使用post请求
    config.method = 'post'
    // if (config.url.endsWith("/download")) {
    // config.method = 'get'
    // }
    config.data = config.params || config.data || {}
    config.params = undefined
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  (response) => {
    if (response.headers.authorization) {
      // 当请求头携带有登录信息，将其设置到 localStorage 中。
      setToken(response.headers.authorization)
    }

    // 判断是否是文件流
    const contentType = response.headers['content-type']
    if (
      contentType.includes('application/vnd.openxmlformats-officedocument') || // Office 文件格式
      contentType.includes('application/pdf') || // PDF
      contentType.includes('application/msword') || // 旧版 Word
      contentType.includes('application/octet-stream') || // 通用二进制流
      contentType.includes('application/zip') // ZIP 包等
    ) {
      return response.data // 直接返回 Blob
    }

    const dataObj = response.data
    // success
    if (dataObj.code === 0) {
      return dataObj.data
    } else if (dataObj.code === 403) {
      // goto home
      Notification.error({
        title: 'go home?',
        duration: 5000,
      })
    } else if (dataObj.code === 1001) {
      removeToken()
      router.push({ name: '/login' })
    } else {
      Notification.error({
        title: dataObj.msg,
        duration: 5000,
      })
      return null
    }
  },
  (error) => {
    // 兼容blob下载出错json提示
    if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = function (e) {
        const errorMsg = JSON.parse(reader.result).message
        Notification.error({
          title: errorMsg,
          duration: 5000,
        })
      }
    } else {
      let code = 0
      try {
        code = error.response.data.status
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          Notification.error({
            title: '网络请求超时',
            duration: 5000,
          })
          return Promise.reject(error)
        }
      }
      console.log(code)
      if (code) {
        if (code === 401) {
          store.dispatch('LogOut').then(() => {
            // 用户登录界面提示
            Cookies.set('point', 401)
            location.reload()
          })
        } else if (code === 403) {
          router.push({ path: '/401' })
        } else {
          const errorMsg = error.response.data.message
          if (errorMsg !== undefined) {
            Notification.error({
              title: errorMsg,
              duration: 5000,
            })
          }
        }
      } else {
        Notification.error({
          title: '接口请求失败',
          duration: 5000,
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
