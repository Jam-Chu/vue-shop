<!--
 * @Author: your name
 * @Date: 2020-02-21 09:58:46
 * @LastEditTime: 2020-02-24 11:52:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\components\goods\params.vue
 -->
<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区 -->
        <el-card>
            <el-alert type="warning" title="只允许第三级分类设置相关参数" show-icon :closable="false"></el-alert>
            <!-- 查询联级选择器 -->
            <el-row>
                <el-col :span="3" class="cas_title">选择商品分类：</el-col>
                <el-col :span="10" class="cas">
                    <el-cascader v-model="cateValue" :options=catelogList :props="cascaderProps" clearable @change="getAttri"></el-cascader>
                </el-col>
            </el-row>
            <!-- 参数列表区 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
              <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" class="paramsAdding" @click="addParamsDialogVisible = true" :disabled="this.cateValue.length === 0 ? true : false">添加参数</el-button>
                <el-table :data="manyAttri" style="width: 100%" border>
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-tag v-for="(item ,index) in scope.row.attr_vals" :key="index" closable @close=removeTag(index,scope.row)>{{item}}</el-tag>
                      <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.addNewValue" ref="addNewValueRef" size="small"  @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"></el-input>
                      <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="#" type="index"></el-table-column>
                  <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                  <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditDialog(scope.row.attr_id)">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="静态参数" name="only">
                <el-button type="primary" class="attriAdding" :disabled="this.cateValue.length === 0 ? true : false" @click="addParamsDialogVisible = true">添加属性</el-button>
                <el-table :data="onlyAttri" style="width: 100%" border>
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.attr_vals">{{scope.row.attr_vals}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="#" type="index"></el-table-column>
                  <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                  <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditDialog(scope.row.attr_id)">修改</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数按钮弹框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addParamsDialogVisible" width="60%" @close="addParamsFormClosed">
          <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRef" label-width="100px">
            <el-form-item :label="titleText +'名'" prop="attr_name">
              <el-input v-model="addParamsForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="addParamsDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handAddParamsDialog">确定</el-button>
          </span>
        </el-dialog>
        <!-- 编辑弹框 -->
        <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
          <el-form :model="editForm" :rules="editRules" ref="editRef" label-width="100px">
            <el-form-item label="参数名称：" prop="attr_name">
              <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button @click="handEditForm" type="primary">确定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    var repeatName = (rule, value, cb) => {
      if (this.activeName === 'many') {
        this.manyAttri.forEach(item => {
          if (item.attr_name === value) { return cb(new Error('新参数名不能与已有名称相同')) }
        })
        cb()
      } else {
        this.onlyAttri.forEach(item => {
          if (item.attr_name === value) { return cb(new Error('新参数名不能与已有名称相同')) }
        })
        cb()
      }
    }
    return {
      // 级联选择器选中的cat_id,三级
      cateValue: [],
      // 所有商品数据
      catelogList: [],
      // 级联选择器参数配置
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 被激活的叶签名称，通过activeName动态控制不同页面渲染过程中，不同数据的获取，不同的数据传输、不同数据的提交，这两个相似页面的相似功能不用再写两份
      activeName: 'many',
      // 动态商品参数接收
      manyAttri: [],
      // 静态商品参数接收
      onlyAttri: [],
      // 添加参数相关
      addParamsDialogVisible: false,
      addParamsForm: {
        attr_name: ''
      },
      addParamsRules: {
        attr_name: [
          { required: true, message: '请输入新参数名称', trigger: 'blur' },
          { validator: repeatName, trigger: 'blur' }
        ]
      },
      // 编辑相关
      editDialogVisible: false,
      editForm: {},
      editRules: {
        attr_name: [
          { required: true, message: '请输入新参数名称', trigger: 'blur' },
          { validator: repeatName, trigger: 'blur' }
        ]
      }
      // Tag标签相关
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
    handleTabClick () {
      this.getAttri()
    },
    async getAttri () {
      if (this.cateValue.length !== 3) {
        this.cateValue = []
        this.manyAttri = []
        this.onlyAttri = []
        return
      }
      // 动态参数的获取
      const { data: res } = await this.$http.get('categories/' + this.cateValue[this.cateValue.length - 1] + '/attributes', { params: { sel: this.activeName } })
      if (res.meta.status !== 200) { return this.$message.error('获取动态参数失败') }
      // 将attr_vals里的字符串表示形式转化为数组表示形式,要先将属性添加到解构出来的res中，再赋值manyAttri，因为如果先赋值，再添加的属性为普通属性，此时表格已被渲染，在下次渲染前不会再监听新添加的普通属性的变化
      if (this.activeName === 'many') {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals !== '' ? item.attr_vals.split(' ') : []
          // 为了能使得每个new tag独立编辑，
          item.inputVisible = false
          item.addNewValue = ''
        })
        this.manyAttri = res.data
      } else {
        this.onlyAttri = res.data
      }
      // 静态参数的获取
      // const { data: olyres } = await this.$http.get('categories/' + this.cateValue[this.cateValue.length - 1] + '/attributes', { params: { sel: 'only' } })
      // if (res.meta.status !== 200) { return this.$message.error('获取静态参数失败') }
      // this.onlyAttri = olyres.data
    },
    // 添加参数相关
    addParamsFormClosed () {
      this.$refs.addParamsRef.resetFields()
    },
    handAddParamsDialog () {
      this.$refs.addParamsRef.validate(async valid => {
        if (valid === false) { return this.$message.error('请重新检查您的重命名是否合法') }
        const { data: res } = await this.$http.post('categories/' + this.cateValue[this.cateValue.length - 1] + '/attributes', { attr_name: this.addParamsForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) { return this.$message.error('添加失败') }
        this.$message.success('添加成功')
        this.getAttri()
        this.addParamsDialogVisible = false
      })
    },
    // 编辑相关
    async openEditDialog (id) {
      const { data: res } = await this.$http.get(`categories/${this.cateValue[this.cateValue.length - 1]}/attributes/${id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) { return this.$message.error('获取参数信息失败') }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editRef.resetFields()
    },
    handEditForm () {
      this.$refs.editRef.validate(async valid => {
        if (valid === false) { return this.$message.error('提交编辑信息失败,请查看格式') }
        const { data: res } = await this.$http.put(`categories/${this.cateValue[this.cateValue.length - 1]}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName, attr_vals: this.editForm.attr_vals })
        if (res.meta.status !== 200) { return this.$message.error('提交编辑失败') }
        console.log(res)
        this.$message.success('提交成功')
        this.getAttri()
        this.editDialogVisible = false
      })
    },
    async removeParams (id) {
      const result = await this.$confirm('此操作会永久移除参数，是否继续', 'warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') { return this.$message.info('已取消删除操作') }
      const { data: res } = await this.$http.delete(`categories/${this.cateValue[this.cateValue.length - 1]}/attributes/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('删除参数失败') }
      this.$message.success('删除参数成功')
      this.getAttri()
    },
    // Tag相关
    async handleInputConfirm (info) {
      if (info.addNewValue.trim().length === 0) {
        info.addNewValue = ''
        info.inputVisible = false
        return
      }
      var inputFlag = true
      for (var i = 0; i <= info.attr_vals.length - 1; i++) {
        if (info.attr_vals[i] === info.addNewValue) {
          inputFlag = false
          this.$message.error('标签名重复')
          break
        }
      }
      console.log(inputFlag)
      if (inputFlag === true) {
        info.attr_vals.push(info.addNewValue.trim())
        info.addNewValue = ''
        info.inputVisible = false
        const { data: res } = await this.$http.put(`categories/${this.cateValue[this.cateValue.length - 1]}/attributes/${info.attr_id}`, { attr_name: info.attr_name, attr_sel: info.attr_sel, attr_vals: info.attr_vals.join(' ') })
        if (res.meta.status !== 200) { return this.$message.error('添加参数标签失败') }
        this.$message.success('添加成功')
      }
    },
    showInput (info) {
      info.inputVisible = true
      // 文本框自动获得焦点????,当页面上的元素被重新渲染之后，才会指定回掉函数中的代码(this.$nextTick(…))
      this.$nextTick(_ => {
        this.$refs.addNewValueRef.$refs.input.focus()
      })
    },
    async removeTag (index, info) {
      info.attr_vals.splice(index, 1)
      const { data: res } = await this.$http.put(`categories/${this.cateValue[this.cateValue.length - 1]}/attributes/${info.attr_id}`, { attr_name: info.attr_name, attr_sel: info.attr_sel, attr_vals: info.attr_vals.join(' ') })
      if (res.meta.status !== 200) { return this.$message.error('删除属性值失败') }
      this.$message.success('删除属性值成功')
    }
  },
  // 按条件动态切换，或需要计算的出结论的放在计算属性中
  computed: {
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cas_title{
    margin-top: 20px
}
.cas{
    margin-top: 8px
}
.addbutton{
  margin: 10px 0
}
.input-new-tag{
  width: 150px;
}
</style>
