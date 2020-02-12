<!--
 * @Author: your name
 * @Date: 2020-02-11 21:00:15
 * @LastEditTime : 2020-02-12 14:43:05
 * @LastEditors  : Please set LastEditors
 * @Description: 登陆页面组件
 * @FilePath: \vue_shop\src\components\login.vue
 -->
<!-- 整个文件是一个单页面组件，所有关于登陆的结构，样式，行为均写在此页面内，定义完成之后，需要再router中通过路由的形式渲染到app.vue根组件中 -->
<!-- ui层 -->
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="ava_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登陆表单区域 -->
        <!-- ref属性指定一个引用名称，$refs.引用名可以取得此个实例对象 -->
        <el-form ref="loginRef" label-width="0px" class="login_form" :model="loginForm" :rules="loginRules">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input  prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input  prefix-icon="iconfont icon-3702mima"  v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <!-- 登陆，重置按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" @click='loginCheck'>登陆</el-button>
            <el-button type="info" @click='resetLogin'>重置</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<!-- 行为层 -->
<script>
export default {
  data () {
    return {
      // 登陆表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单填写规范校验的规则声明
      loginRules: {
        // 用户名合法的校验
        username: [
          // required键值对表示必填项与否，message为错误提示信息，trigger为触发提示信息的条件，此处为鼠标失去焦点（不再选中输入框）
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3~10字符之间', trigger: 'blur' }
        ],
        // 密码合法的校验
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码最少6位，最多15位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置按钮的事件函数
    resetLogin: function () {
      // this指向整个login组件（整个页面）,refs管理整个DOM实例对象的引用？
      this.$refs.loginRef.resetFields()
    },
    loginCheck: function () {
      // 点击登陆按钮产生的合法表单提交的验证,以及提交请求
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return
        const { data: obj } = await this.$http.post('login', this.loginForm)
        if (obj.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        // 保存token令牌到当前网站的sessionStorage中
        window.sessionStorage.setItem('token', obj.data.token)
        // 通过编程式导航对象跳转到后台页面，路由地址为 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<!-- 样式层 -->
<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);

  .ava_box{
    height: 130px;
    width:130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ccc;
    position: absolute;
    left:50%;
    transform: translate(-50%,-50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // 右侧超出的原因为box-sizing为content=box，要改为border-box
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
