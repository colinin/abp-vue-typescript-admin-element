import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { TenantModule } from '@/store/modules/tenant'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 30000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers.Authorization = UserModule.token
    }
    console.log('CurrentTenant  =====> ' + TenantModule.tenantId)
    if (TenantModule.tenantId) {
      config.headers.__tenant = TenantModule.tenantId
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log(error.response)
    if (error.response.status === 401) {
      MessageBox.confirm(
        '身份令牌已过期,请重新登录!',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        UserModule.ResetToken()
        location.reload() // To prevent bugs from vue-router
      })
    }
    if (error.response.status === 429) {
      console.log(error.response.data)
      Message({
        message: '请求流量峰值已达服务器设置上限,请稍后再试!',
        type: 'warning',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
    let message = error.message
    if (error.response.headers._abperrorformat) {
      message = error.response.data.error.message + error.response.data.error.details
    } else if (error.response.headers._abperrorformat) {
      message = error.response.data.error_description
    }

    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
