/*
 * @Author: your name
 * @Date: 2020-02-11 15:52:52
 * @LastEditTime: 2020-02-18 19:56:02
 * @LastEditors: Please set LastEditors
 * @Description: ElementUI组件注册
 * @FilePath: \vue_shop\src\plugins\element.js
 */
// 注：所有element组件标签的名字都可以当作calss名使用
import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Menu, Submenu, MenuItem, Main, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select, Option } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
