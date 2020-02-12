<!--
 * @Author: your name
 * @Date: 2020-02-12 14:33:27
 * @LastEditTime : 2020-02-12 15:04:57
 * @LastEditors  : Please set LastEditors
 * @Description: 主页组件
 * @FilePath: \vue_shop\src\components\home.vue
 -->
<template>
    <div>
        <el-button type="info" @click='logout'>退出</el-button>
    </div>
</template>

<script>

export default {
  methods: {
    logout: function () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
