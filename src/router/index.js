/*
 * @Author: your name
 * @Date: 2020-02-11 15:50:07
 * @LastEditTime: 2020-02-27 16:45:07
 * @LastEditors: Please set LastEditors
 * @Description: 页面路由注册
 * @FilePath: \vue_shop\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/login.vue'
// import Home from '../components/home.vue'
// import Welcome from '../components/welcome'
const Login = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/login.vue')
const Home = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/home.vue')
const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/welcome')

// import Users from '../components/users/users'
// import Rights from '../components/right/rights'
// import Roles from '../components/right/roles'
const Users = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/users/users')
const Rights = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/right/rights')
const Roles = () => import(/* webpackChunkName: "users-rights-roles" */ '../components/right/roles')

// import Cates from '../components/goods/cates'
// import Params from '../components/goods/params'
const Cates = () => import(/* webpackChunkName: "cates-params" */ '../components/goods/cates')
const Params = () => import(/* webpackChunkName: "cates-params" */ '../components/goods/params')

// import List from '../components/goods/list'
// import Add from '../components/goods/add'
const List = () => import(/* webpackChunkName: "list-add" */ '../components/goods/list')
const Add = () => import(/* webpackChunkName: "list-add" */ '../components/goods/add')

// import Order from '../components/orders/order'
// import Reports from '../components/report/report'
const Order = () => import(/* webpackChunkName: "order-reports" */ '../components/orders/order')
const Reports = () => import(/* webpackChunkName: "order-reports" */ '../components/report/report')
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{ path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cates },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Reports }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to是将要访问的路径，from是从那个路径跳转而来，next是一个放行函数
  // 若访问的是login页面，则直接放行
  if (to.path === '/login') { return next() }
  // 否则，需要先获取token,若token存在，则说明已登陆，放行；否则，强制跳转到登陆页面
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) { return next('/login') }
  next()
})

export default router
