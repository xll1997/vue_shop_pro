import Vue from 'vue'
import Router from 'vue-router'
// 引入login
import Login from '@/components/Login.vue'
// 引入后台首页面home
import Home from '@/components/Home.vue'
Vue.use(Router)
export default new Router({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {path: '/home', component: Home}
  ]
})
