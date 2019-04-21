import Vue from 'vue'
import App from './App'
import router from './router'

// 引入全局控制css样式文件
import './assets/css/global.css'
// 引入字体图标
import './assets/fonts/iconfont.css'

// 引入axios
import axios from 'axios'

// 引入element-ui，并做配置
import ElementUI from 'element-ui'
Vue.use(ElementUI)

// 引入axios和配置
axios.defaults.baseURL = ''
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
