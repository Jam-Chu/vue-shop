<!--
 * @Author: your name
 * @Date: 2020-02-17 15:13:27
 * @LastEditTime: 2020-02-18 16:28:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\components\right\roles.vue
 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
            <el-table :data="rolesList" :border="true" :stripe="true">
                <!-- 表格的展开列 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <!-- 注：每个row可以分成24个col单位 -->
                    <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['row-bottom', index1 == 0 ? 'row-top' : '','verticalcenter']">
                      <el-col :span="5">
                        <el-tag closable @close="removeTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="19">
                        <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2 == 0 ?'' : 'row-top','verticalcenter']">
                          <el-col :span="6">
                            <el-tag closable type="success" @close="removeTag(scope.row,item2.id)">{{item2.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                          </el-col>
                          <el-col :span="18">
                            <el-tag closable type="warning" v-for="(item3) in item2.children" :key="item3.id" @close="removeTag(scope.row,item3.id)">{{item3.authName}}</el-tag>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditRolesForm(scope.row)">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoles(scope.row.id)">删除</el-button>
                      <el-button type="warning" icon="el-icon-setting" size="mini" @click="openSettingDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色的弹框 -->
        <el-dialog title="添加角色" width="50%" :visible.sync="addRoleVisible" @close="addRoleDialogClosed">
            <el-form ref="addRolesRef" label-width="100px" :model="addRoleForm" :rules="addRoleRules">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addRoleVisible = false">取消</el-button>
                <el-button type="primary" @click="handAddRoleForm">确定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑操作弹框 -->
        <el-dialog title="修改角色信息" width="50%" :visible.sync="editRoleDialogVisible" @close="editRoleDialogClosed">
            <el-form :model="editRoleForm" label-width="100px" ref="editRoleRef">
                <el-form-item label="角色名称">
                    <el-input v-model="editRoleForm.roleName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editRoleDialogVisible = false">取消</el-button>
                <el-button @click="handEditRoleForm" type="primary">确定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限弹框 -->
        <el-dialog title="分配权限" :visible.sync="settingDialogVisible" width="50%" @close="settingDialogClosed">
          <el-tree :data="rightsList" :props="treeProps" :show-checkbox="true" node-key="id" default-expand-all :default-checked-keys="defKeys" ref="settingDialogRef"></el-tree>
          <span slot="footer">
            <el-button @click="settingDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handSettingDialog">确定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 初始化的参数接收，数组形式，元素类型是对象
      rolesList: [],
      rightsList: [],
      // 树形控件属性绑定对象,指定数据源中需要展示的指定数据
      treeProps: {
        // 展示的数据指定
        label: 'authName',
        // 父子嵌套的对象指定
        children: 'children'
      },
      roleId: '',
      defKeys: [],
      // 添加角色的弹框控制开关，默认关闭
      addRoleVisible: false,
      editRoleDialogVisible: false,
      settingDialogVisible: false,
      //  添加用户弹框需要提交给后端的表单数据暂存，与表单标签通过:model动态绑定，其内元素与输入域标签通过v-model属性一一双向绑定
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      //  添加角色的表单提交验证规则集合，对象形式，包含各个数据项的验证规则
      addRoleRules: {
        roleName: { required: true, message: '请填写角色名' }
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) { return this.$message.error('返回角色列表失败') }
      this.rolesList = res.data
    },
    addRoleDialogClosed () {
      this.$refs.addRolesRef.resetFields()
    },
    editRoleDialogClosed () {
      this.$refs.editRoleRef.resetFields()
    },
    settingDialogClosed () {
      this.defKeys = []
    },
    handAddRoleForm () {
      this.$refs.addRolesRef.validate(async (valid) => {
        if (!valid) return
        // 若表单验证合法
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) { return this.$message.error('添加角色失败') }
        this.$message.success('添加角色成功')
        this.addRoleVisible = false
      })
      this.getRolesList()
    },
    openEditRolesForm (info) {
      this.editRoleForm.roleName = info.roleName
      this.editRoleForm.roleDesc = info.roleDesc
      this.editRoleForm.id = info.id
      this.editRoleDialogVisible = true
    },
    async handEditRoleForm () {
      console.log(this.editRoleForm)
      const { data: res } = await this.$http.put('roles/' + this.editRoleForm.id, { roleName: this.editRoleForm.roleName, roleDesc: this.editRoleForm.roleDesc })
      console.log(res)
      if (res.meta.status !== 200) { return this.$message.error('修改角色信息失败') }
      this.$message.success('修改角色信息成功')
      this.getRolesList()
      this.editRoleDialogVisible = false
    },
    async removeRoles (id) {
      const confirmResult = await this.$confirm('此操作将永久删除角色信息，是否继续？', 'warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') { return this.$message.info('已取消删除操作') }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) { return this.$mesage.error('删除角色失败') }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    async removeTag (role, rightId) {
      const confirmResult = await this.$confirm('您确认要永久删除该角色权限吗？', 'warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') { return this.$message.info('已取消删除标签') }
      const { data: res } = await this.$http.delete('roles/' + role.id + '/rights/' + rightId)
      if (res.meta.status !== 200) { return this.$message.error('删除标签失败') }
      this.$message.success('删除角色权限成功')
      role.children = res.data
    },
    async openSettingDialog (node) {
      this.settingDialogVisible = true
      this.roleId = node.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) { return this.$message.error('获取权限列表失败') }
      this.rightsList = res.data
      this.fillTheDefkeys(node, this.defKeys)
    },
    // 根据行信息，递归获取需要勾选的标签的id的数组
    fillTheDefkeys (node, arr) {
      if (!node.children) { return arr.push(node.id) }
      node.children.forEach((fnode) => {
        this.fillTheDefkeys(fnode, arr)
      })
    },
    async handSettingDialog () {
      // ES6展开运算符
      const nodekeys = [
        ...this.$refs.settingDialogRef.getCheckedKeys(), ...this.$refs.settingDialogRef.getHalfCheckedKeys()
      ]
      const idStr = nodekeys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) { return this.$message.error('修改角色权限失败') }
      this.$message.success('修改角色权限成功')
      this.getRolesList()
      this.settingDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
// 垂直居中
.verticalcenter{
  display: flex;
  align-items: center;
}
</style>
