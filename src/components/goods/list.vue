<!--
 * @Author: your name
 * @Date: 2020-02-24 12:01:32
 * @LastEditTime: 2020-02-25 11:15:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\components\goods\list.vue
 -->
<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 头部 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 表格区 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格（元）" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="220px">
                    <!-- template+作用域插槽实现自定义页面的渲染,过滤器的使用 -->
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeGoods(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页功能 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5,10,15,20]" :page-size="queryInfo.pagesize" :total="total" layout="total, sizes, prev, pager, next, jumper" background></el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 请求的参数
      queryInfo: {
        query: '',
        // 完成size的赋值后，总页数确定，取第几页
        pagenum: 1,
        // 每页几条的确定
        pagesize: 10
      },
      // 初始化获取商品列表数据
      goodsList: [],
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    //  get参数请求都需要加params: {}
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('获取商品列表失败') }
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.goodsList)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeGoods (id) {
      const result = await this.$confirm('此操作将永久删除商品，是否继续', 'warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') { return this.$message.info('已取消') }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) { return this.$message.error('删除商品失败') }
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    // 点击触发页面跳转函数
    goAddpage () {
      this.$router.push('../goods/add')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
