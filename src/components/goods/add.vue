<!--
 * @Author: your name
 * @Date: 2020-02-25 11:14:13
 * @LastEditTime: 2020-02-26 14:14:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\components\goods\add.vue
 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path:'/goods'}">商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 头部提示 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <!-- 操作步骤条 -->
            <el-steps align-center :active="activeIndex-0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 表单 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100%" label-position="top">
                <!-- 左侧tab -->
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader :options="catelogList" placeholder="请选择商品" clearable :props="cateProps" v-model="addForm.goods_cat" @change="handleCascaderChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyAttri" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals" >
                                <el-checkbox v-for="(att,i) in item.attr_vals" :key="i" :label="att" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyAttri" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                      <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove"
                      :on-success="handleSuccess"
                      :headers="headersObj"
                      list-type="picture" >
                        <el-button size="mini" type="primary">点击上传</el-button>
                      </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                      <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                      <el-button type="primary" class="btnAdd" @click="handAddForm">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 预览图片弹框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
          <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
// 导入lodash深拷贝模块
import _ from 'lodash'
export default {
  // 导入lodash深拷贝模块
  data () {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 级联选择框的多级value值保存
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      catelogList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择对应商品', trigger: 'blur' }
        ]
      },
      manyAttri: [],
      onlyAttri: [],
      // 图片上传组件的headers请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created () {
    this.fillTheCascader()
  },
  methods: {
    async fillTheCascader () {
      const { data: res } = await this.$http.get('categories')
      this.catelogList = res.data
    },
    handleCascaderChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateThirdId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) { return this.$message.error('获取动态参数列表失败') }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyAttri = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateThirdId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) { return this.$message.error('获取动态参数列表失败') }
        this.onlyAttri = res.data
      }
    },
    handlePreview (picFile) {
      this.previewPath = picFile.response.data.url
      this.previewVisible = true
    },
    handleRemove (picFile) {
      // picFile为图片的信息，包括图片名称，上传成功消息等
      // console.log(picFile)
      const FilePath = picFile.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => item.pic === FilePath)
      this.addForm.pics.splice(index, 1)
    },
    handleSuccess (response) {
      // response为图片临时上传成功的成功消息
      // console.log(response)
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    handAddForm () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid === false) { return this.$message.error('请填写必要的表单项') }
        // 因为cascader双向绑定到的addForm的cat要求是一个数组，而提交表单的时候将其转化为了字符串，此时无法满足cascader的数组要求了，所以提交时需要深拷贝一份addForm，采用lodash包中的cloneDeep(obj)方法
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 动静态参数在form中的添加
        this.manyAttri.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyAttri.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) { return this.$message.error('添加商品失败') }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateThirdId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox{
    margin: 0 5px 0 0
}
.previewImg{
  width: 100%
}
.btnAdd{
  margin-top: 15px
}
</style>
