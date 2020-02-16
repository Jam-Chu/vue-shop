<!--
 * @Author: your name
 * @Date: 2020-02-14 15:09:25
 * @LastEditTime : 2020-02-15 15:36:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\components\users\users.vue
 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
          <!-- 搜索区 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" :clearable="true" @clear="getUserList">
                       <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="isVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 添加用户弹框 -->
            <el-dialog title="添加用户" :visible.sync="isVisible" width="50%" @close="addDialogClosed()">
              <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="isVisible = false">取消</el-button>
                <el-button @click="addUser" type="primary">确定</el-button>
              </span>
            </el-dialog>
          <!-- 用户列表区 -->
            <el-table :data="userlist" :border='true' :stripe="true">
              <el-table-column label="#" type="index"></el-table-column>
              <el-table-column label="姓名" prop="username"></el-table-column>
              <el-table-column label="邮箱" prop="email"></el-table-column>
              <el-table-column label="电话" prop="mobile"></el-table-column>
              <el-table-column label="角色" prop="role_name"></el-table-column>
              <el-table-column label="状态" prop="mg_state">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.mg_state" active-color="#13ce66" @change="userStateChange(scope.row)"></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                  <!-- 修改用户信息 -->
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)" ></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUsers(scope.row.id)"></el-button>
                  <el-tooltip placement="top" effect="dark" content="分配角色" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <!-- 修改用户弹框 -->
            <el-dialog title="修改用户信息" :visible.sync="editVisible" width="50%" @close="editDialogClosed">
              <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                <el-form-item label="用户名">
                  <el-input v-model="editForm.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer">
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary"
                @click="handEditDialog">确定</el-button>
              </span>
            </el-dialog>
            <!-- 分配角色弹框，等待权限组件完成后制作 -->
          <!-- 分页区 -->
            <el-pagination @size-change='handleSizeChange($event)'        @current-change='handleCurrentChange($event)' :current-page="queryInfo.pagenum" :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize" layout="
            total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    // elementUI的自义定表单验证规则
    var checkEmail = (rule, value, cb) => {
      // 正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) { return cb() }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951?)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) { return cb() }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 发请求需要提交的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      isVisible: false,
      editVisible: false,
      editForm: {},
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名长度在6~15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('获取用户列表失败') }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChange (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        // 若失败，则重置用户刚才的操作
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 表单验证合法，真正发起请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) { this.$message.error('添加用户失败') }
        this.$message.success('添加用户成功')
        // 关闭对话框
        this.isVisible = false
        // 刷新列表
        this.getUserList()
      })
    },
    async showEditDialog (id) {
      this.editVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editForm = res.data
    },
    handEditDialog () {
      // 验证通过后的提交
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) { return this.$message.error('更新用户信息失败') }
        this.$message.success('更新成功')
      })
      // 关闭窗口
      this.editVisible = false
      // 刷新列表
      this.getUserList()
      // 提示更新成功
    },
    async removeUsers (id) {
      // 询问用户的确认弹框,返回promise对象，用async/await简化promise操作
      const confirmResult = await this.$confirm('此操作将永久删除该用户，是否继续', 'warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // 此时如果用用户点击确定，返回字符串confirm，否则返回confirm内部的错误error,捕获后，返回字符串cancel
      }).catch(err => { return err })
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) { return this.$message.error('删除操作失败') }
      console.log(res)
      this.$message.success('删除用户成功')
      // 刷新列表
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
