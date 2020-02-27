/*
 * @Author: your name
 * @Date: 2020-02-27 13:08:27
 * @LastEditTime: 2020-02-27 16:07:04
 * @LastEditors: Please set LastEditors
 * @Description: 发布阶段的入口文件
 * @FilePath: \vue_shop\src\main-prod.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入axios通信,并配置
import axios from 'axios'
// 导入后安装插件 vue-table-with-tree-grid,树形表格定制标签
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// 导入axios加载进度条的样式表与js
import Nprogress from 'nprogress'
// import 'nprogress/nprogress.css'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置拦截器request,在此展示进度条
axios.interceptors.request.use(config => {
  Nprogress.start()
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 设置拦截器response,在此取消进度条
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
// 在全局js中注册一个过滤器dateFormat，用于格式化日期，可被所有组件调用
Vue.filter('dateFormat', function (originValue) {
  const date = new Date(originValue)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 + '').padStart(2, '0')
  const day = (date.getDate() + '').padStart(2, '0')
  const hour = (date.getHours() + '').padStart(2, '0')
  const minute = (date.getMinutes() + '').padStart(2, '0')
  const second = (date.getSeconds() + '').padStart(2, '0')
  return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
