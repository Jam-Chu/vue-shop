/*
 * @Author: your name
 * @Date: 2020-02-11 15:50:07
 * @LastEditTime: 2020-02-19 15:03:32
 * @LastEditors: Please set LastEditors
 * @Description: 配置，依赖入口文件
 * @FilePath: \vue_shop\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios通信,并配置
import axios from 'axios'
// 导入后安装插件 vue-table-with-tree-grid,树形表格定制标签
import TreeTable from 'vue-table-with-tree-grid'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置拦截器
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
