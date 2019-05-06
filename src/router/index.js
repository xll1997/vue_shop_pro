import Vue from 'vue'
import VueRouter from 'vue-router'

// const Foo = () => Promise.resolve({ /* component definition */ })

// 引入login
// import Login from '@/components/Login.vue'
const Login = () => import('@/components/Login.vue')
// 引入后台首页面home
const Home = () => import('@/components/Home.vue')
// import Home from '@/components/Home.vue'
// 引入welcome
const Welcome = () => import('@/components/Welcome.vue')
// import Welcome from '@/components/Welcome.vue'
// 引入User
const User = () => import('@/components/User.vue')
// import User from '@/components/User.vue'
// 引入Rights
const Rights = () => import('@/components/Rights.vue')
// import Rights from '@/components/Rights.vue'
// 引入Role
const Role = () => import('@/components/Role.vue')
// import Role from '@/components/Role.vue'
// 引入Cat
const Cat = () => import('@/components/Cat.vue')
// import Cat from '@/components/Cat.vue'
// 引入Param
const Param = () => import('@/components/Param.vue')
// import Param from '@/components/Param.vue'
// 引入Goods
const Goods = () => import('@/components/Goods.vue')
// import Goods from '@/components/Goods.vue'
// 引入GoodsAdd
const GoodsAdd = () => import('@/components/GoodsAdd.vue')
// import GoodsAdd from '@/components/GoodsAdd.vue'
// 引入Order
const Order = () => import('@/components/Order.vue')
// import Order from '@/components/Order.vue'
// 引入Report
const Report = () => import('@/components/Report.vue')
// import Report from '@/components/Report.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {path: '/', redirect: '/home'},
    {path: '/login', component: Login},
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {path: '/welcome', component: Welcome},
        {path: '/users', component: User},
        {path: '/rights', component: Rights},
        {path: '/roles', component: Role},
        {path: '/categories', component: Cat},
        {path: '/params', component: Param},
        {path: '/goods', component: Goods},
        {path: '/goodsadd', component: GoodsAdd},
        {path: '/orders', component: Order},
        {path: '/reports', component: Report}
      ]
    }
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
