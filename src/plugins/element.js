/*
 * @Author: your name
 * @Date: 2020-02-11 15:52:52
 * @LastEditTime : 2020-02-12 14:42:52
 * @LastEditors  : Please set LastEditors
 * @Description: ElementUI组件注册
 * @FilePath: \vue_shop\src\plugins\element.js
 */
import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.prototype.$message = Message
