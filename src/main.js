import Vue from 'vue'
import App from './App'
import router from './router'

// 引入全局控制css样式文件
import './assets/css/global.css'
// 引入字体图标
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'

// 引入全局面包屑导航
import Crumb from './components/Share/Crumb.vue'

// 引入progress
// 引入过渡动画
import nprogress from 'nprogress'
import '../node_modules/nprogress/nprogress.css'

// 引入时间处理
import moment from 'moment'

// 引入element-ui，并做配置
import ELEMENT from 'element-ui'
// 注册ElementUI给vue
Vue.use(ELEMENT)

// 将面包屑导航注册为全局组件
Vue.component('com-crumb', Crumb)

// 注册时间全局组件
Vue.filter('dateFormat', v => {
  return moment(v).format('YYYY-MM-DD')
})

// 引入axios和配置
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// axios的请求拦截器
axios.interceptors.request.use(function(config) {
  // console.dir(axios)
  // console.dir(config)
  nprogress.start()
  var token = window.sessionStorage.getItem('token')
  if (token !== null) {
    config.headers.Authorization = token
  }
  return config
}, function(error) {
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  nprogress.done()
  return response
}, function(error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
