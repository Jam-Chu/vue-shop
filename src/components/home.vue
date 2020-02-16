<!--
 * @Author: your name
 * @Date: 2020-02-12 14:33:27
 * @LastEditTime : 2020-02-14 17:12:16
 * @LastEditors  : Please set LastEditors
 * @Description: 主页组件
 * @FilePath: \vue_shop\src\components\home.vue
 -->
<template>
  <!-- 总布局容器 -->
  <el-container class="home">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/title2.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click='logout'>退出</el-button>
    </el-header>
    <!-- body布局容器区 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- <el-aside :width="acticeWidth+'px'"> -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域包裹标签 -->
        <el-menu  background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
      <!-- 第一个一级菜单项，可下拉 -->
          <!-- index能指定下拉菜单的下拉唯一性，但index属性只接受字符串 -->
          <el-submenu :index="item.id+''" v-for="(item) in menulist" :key=item.id>
            <template slot="title">
              <i :class="iconobj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subitem.path" v-for="(subitem) in item.children" :key=subitem.id @click='saveNavState("/"+subitem.path)'>
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
            <!-- 一级菜单项的下拉菜单包裹，不可再下拉，具名插槽方式
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group> -->
            <!-- 一级菜单项的下拉菜单包裹，不可再下拉，直接title方式 -->
            <!-- <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item> -->
              <!-- 此项为一个可下拉的子项 -->
              <!-- <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项4</el-menu-item> -->
              <!-- </el-submenu> -->
            <!-- </el-menu-item-group> -->
          </el-submenu>
      <!-- 第二个一级菜单项，可下拉 -->
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航二</span>
            </template>
          </el-submenu> -->
      <!-- 第三个一级菜单项，可下拉 -->
          <!-- <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航三</span>
            </template>
          </el-submenu> -->
      <!-- 第四个一级菜单项，可下拉 -->
          <!-- <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航四</span>
            </template>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <!-- 主体显示 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  data () {
    return {
      // 从服务器获取的菜单数据
      menulist: [],
      iconobj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
      // acticeWidth: 200
    }
  },
  // 生命周期函数，起始时左侧菜单获取
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message({
        showClose: true,
        message: '退出成功，请重新登陆'
      })
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // 错误报告
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // ***从后端得到的数据存储到组件的data中
      this.menulist = res.data
      // console.log(res)
      // console.log(this.menulist)
    },
    toggleCollapse () {
      // 点击按钮，切换菜单的折叠与展开
      this.isCollapse = !this.isCollapse
      // 麻烦的写法，不可取
      // if (this.acticeWidth === 200) {
      //   this.acticeWidth = 64
      // } else {
      //   this.acticeWidth = 200
      // }
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .home{
    height: 100%;
  }
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    > div{
      display: flex;
      align-items: center;
      > span{
      color: #fff;
      font-size: 20px;
      margin-left: 5px;
      }
    }
    > .el-button{
      background-color: tomato;
      font-family: Arial;
      font-size: 15px
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
