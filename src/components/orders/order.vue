<!--
 * @Author: your name
 * @Date: 2020-02-26 20:03:26
 * @LastEditTime: 2020-02-27 11:01:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue_shop\src\components\orders\order.vue
 -->
<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 搜索区 -->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" style="width: 50%" clearable @clear="getOrdersList">
                <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
            </el-input>
            <!-- 卡片试图区 -->
            <el-table :data="ordersList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
                <el-table-column label="是否付款" prop="order_pay" width="100px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.order_pay === 1" type="success">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
                <el-table-column label="下单时间" prop="create_time" width="240px">
                    <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditDialog"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" @click="openProgressBox"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页条 -->
            <el-pagination @size-change="handleSizeChange($event)" @current-change="handleCurrentChange($event)" :page-sizes="[5,10,15]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>
        <!-- 修改弹框 -->
        <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
          <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
            <el-form-item label="省市区/县" prop="city">
              <el-cascader :options="CityData" v-model="addressForm.city"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="detail">
              <el-input v-model="addressForm.detail"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handAddressForm">确定</el-button>
          </span>
        </el-dialog>
        <!-- 展示物流进度弹框 -->
        <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in progressInfo" :key="index" :timestamp="item.time">{{item.context}}</el-timeline-item>
          </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
import CityData from '../orders/citydata'
export default {
  data () {
    return {
      // 表格相关
      orderInput: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      ordersList: [],
      total: 0,
      // 修改弹框
      editDialogVisible: false,
      addressForm: {
        city: [],
        detail: ''
      },
      addressFormRules: {
        city: [
          { required: true, message: '请选择地区', trigger: 'blur' }
        ],
        detail: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      CityData,
      // 展示物流进度
      progressVisible: false,
      progressInfo: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getOrdersList()
    },
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getOrdersList()
    },
    openEditDialog () {
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    handAddressForm () {
      this.$message.success('修改成功')
      this.editDialogVisible = false
    },
    async openProgressBox () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) { return this.$message.error('获取物流信息失败') }
      this.progressInfo = res.data
      console.log(this.progressInfo)
      this.progressVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
