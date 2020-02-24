<!--
 * @Author: your name
 * @Date: 2020-02-19 13:25:26
 * @LastEditTime: 2020-02-21 16:36:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\components\goods\cate.vue
 -->
<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <el-button type="primary" @click='showAdddialog'>添加分类</el-button>
            <tree-table :data="catelogList" :columns="columns" :selection-type="false" :expand-type="false" class="tree-table" show-index index-text="#" border :show-row-hover="false">
              <template slot="isok" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: green"></i>
                <i class="el-icon-error" v-else style="color: red"></i>
              </template>
              <template slot="order" slot-scope="scope">
                <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                <el-tag type="warning" size="mini" v-else>三级</el-tag>
              </template>
              <template slot="operate" slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="openEditlog(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCatelog(scope.row.cat_id)">删除</el-button>
              </template>
            </tree-table>
            <el-pagination @size-change='handleSizeChange($event)' @current-change='handleCurrentChange($event)' :current-page="queryInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="queryInfo.pagesize" layout="
            total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>
        <!-- 添加分类弹框 -->
        <el-dialog title="添加分类" :visible.sync="addcatelogDialogVisible" width="50%" @close="addlogDialogClosed">
          <el-form :model="addlogForm" :rules="addlogRules" ref="addlogRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="addlogForm.cat_name"></el-input>
            </el-form-item >
            <el-form-item label="父级分类" >
              <el-cascader v-model="addlogForm.selected" :options="cascaderList" placeholder="请选择" :props="propsObj" @change="casChange" :clearable="true" :change-on-select="true"></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="addcatelogDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handaddlogForm">确定</el-button>
          </span>
        </el-dialog>
        <!-- 修改弹框 -->
        <el-dialog title="修改分类名称" :visible.sync="editlogVisible" width="50%" @click="editlogDialogClosed">
          <el-form :model="editlogForm" :rules="editlogRules" ref="editlogRef" label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
              <el-input v-model="editlogForm.cat_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="editlogVisible = false">取消</el-button>
            <el-button type="primary" @click="handEditDialog">确定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    var repeatName = (rule, value, cb) => {
      if (value !== this.editlogForm.proto_catname) { return cb() }
      cb(new Error('新用户名不能与原来相同'))
    }
    return {
      // 添加分类弹框相关
      addcatelogDialogVisible: false,
      addlogForm: {
        cat_name: '',
        selected: [],
        cat_pid: 0,
        cat_level: 0
      },
      editlogVisible: false,
      editlogForm: {
        cat_id: '',
        cat_name: '',
        proto_catname: ''
      },
      propsObj: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      addlogRules: {
        // 分类规则的关联由el-form-item中的prop属性指定
        cat_name: [
          { required: true, message: '请输入类名', trigger: 'blur' }
        ]
      },
      editlogRules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: repeatName, trigger: 'blur' }
        ]
      },
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelogList: [],
      cascaderList: [],
      total: 0,
      // tree-table 的列定义
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { lable: '是否有效', type: 'template', template: 'isok' },
        { lable: '排序', type: 'template', template: 'order' },
        { lable: '操作', type: 'template', template: 'operate' }
      ]
    }
  },
  created () {
    this.getCatelogList()
  },
  methods: {
    async getCatelogList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('获取商品列表失败') }
      this.catelogList = res.data.result
      this.total = res.data.total
      console.log(this.catelogList)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCatelogList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCatelogList()
    },
    addlogDialogClosed () {
      this.$refs.addlogRef.resetFields()
      this.addlogForm.selected = []
      this.addlogForm.cat_pid = 0
      this.addlogForm.cat_level = 0
    },
    casChange () {
      console.log(this.addlogForm.selected)
      if (this.addlogForm.selected.length > 0) {
        this.addlogForm.cat_pid = this.addlogForm.selected[this.addlogForm.selected.length - 1]
        this.addlogForm.cat_level = this.addlogForm.selected.length
      } else {
        this.addlogForm.cat_pid = 0
        this.addlogForm.cat_level = 0
      }
    },
    handaddlogForm () {
      this.$refs.addlogRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', { cat_pid: this.addlogForm.cat_pid, cat_name: this.addlogForm.cat_name, cat_level: this.addlogForm.cat_level })
        console.log(res)
        if (res.meta.status !== 201) { return this.$message.error('添加分类失败') }
        this.$message.success('添加分类成功')
        this.getCatelogList()
        this.addcatelogDialogVisible = false
      })
    },
    openEditlog (info) {
      this.editlogVisible = true
      this.editlogForm.cat_id = info.cat_id
      this.editlogForm.cat_name = info.cat_name
      this.editlogForm.proto_catname = info.cat_name
    },
    editlogDialogClosed () {
      this.editlogForm.id = ''
      this.editlogForm.cat_name = ''
      this.editlogForm.proto_catname = ''
    },
    handEditDialog () {
      this.$refs.editlogRef.validate(async valid => {
        if (valid === false) { return this.$message.error('请重新检查您的重命名是否合法') }
        const { data: res } = await this.$http.put('categories/' + this.editlogForm.cat_id, {
          cat_name: this.editlogForm.cat_name
        })
        if (res.meta.status !== 200) { return this.$message.error('修改名称失败') }
        this.$message.success('更新名称成功')
        this.getCatelogList()
        this.editlogVisible = false
      })
    },
    async removeCatelog (id) {
      console.log(id)
      const result = await this.$confirm('此操作会永久删除此分类商品，是否继续', 'warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') { return this.$message.info('已取消删除操作') }
      const { data: res } = await this.$http.delete('categories/' + id)
      console.log(res)
      if (res.meta.status !== 200) { return this.$message.error('删除商品失败') }
      this.$message.success('删除商品成功')
      this.getCatelogList()
    },
    async getparentList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) { return this.$message.error('获取下拉列表失败') }
      this.cascaderList = res.data
      console.log(this.cascaderList)
    },
    showAdddialog () {
      this.getparentList()
      this.addcatelogDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
