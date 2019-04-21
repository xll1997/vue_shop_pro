import Vue from 'vue'
import Router from 'vue-router'
// 引入login
import Login from '@/components/Login.vue'
// 引入后台首页面home
import Home from '@/components/Home.vue'
Vue.use(Router)
const router = new Router({
  routes: [
    {path: '/login', component: Login},
    {path: '/home', component: Home}
  ]
})

// 设置路由守卫
router.beforeEach((to, from, next) => {
  var token = window.sessionStorage.getItem('token')
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
