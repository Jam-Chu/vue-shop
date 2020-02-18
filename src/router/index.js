/*
 * @Author: your name
 * @Date: 2020-02-11 15:50:07
 * @LastEditTime: 2020-02-17 15:16:13
 * @LastEditors: Please set LastEditors
 * @Description: 页面路由注册
 * @FilePath: \vue_shop\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome'
// Welcome是子路由，属于home页面的组件
import Users from '../components/users/users'
import Rights from '../components/right/rights'
import Roles from '../components/right/roles'

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
        { path: '/roles', component: Roles }]
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
