<template>
  <div>
    <com-crumb nm="商品"/>

    <!-- 物流弹出层 -->
    <el-dialog title="物流信息" :visible.sync="wuliuDialogVisible" width="50%">
      <el-steps direction="vertical" :active="1">
        <el-step
          :title="item.ftime"
          v-for="(item,i) in wuliuList"
          :key="i"
          :description="item.context"
        ></el-step>
      </el-steps>
    </el-dialog>

    <el-card class="box-card">
      <!-- 搜索框 -->
      <!--
        :gutter="20" 设置每个el-col的彼此间隔
        :span=xx 设置每个el-col占据的宽度
      -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="orderSearch" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 绘制表格 -->
      <el-table :data="userList" border style="width: 100%">
        <!-- <el-table-column prop="pagenum" label="序号" width="60"></el-table-column> -->
        <el-table-column type="index" width="60" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="130"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="130">
          <el-tag type="warning" slot-scope="info">{{ info.row.pay_status==="0" ? "未付款" : "已付款" }}</el-tag>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
        <el-table-column prop="update_time" label="下单时间">
          <template slot-scope="info">{{ info.row.update_time | dateFormat }}</template>
        </el-table-column>
        <el-table-column prop="order_id" label="操作">
          <template slot-scope="info">
            <el-button icon="el-icon-edit" size="mini" type="primary" title="修改订单"></el-button>
            <el-button
              icon="el-icon-location"
              size="mini"
              type="success"
              title="查看物流信息"
              @click="showWuliu(info.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUseList()
  },
  methods: {
    /* 物流弹出层 */
    async showWuliu(id) {
      // console.log(id)
      // ! id值咋来的
      const { data: dt } = await this.$http.get(`/kuaidi/81337523816`)
      // const { data: dt } = await this.$http.get(`/kuaidi/${id}`)
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.wuliuList = dt.data
      // console.log(this.wuliuList)
      this.wuliuDialogVisible = true
    },
    // pageSize发生变化时，每页条数变化的处理
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.querycdt.pagesize = val
      this.getUseList()
    },
    // 改变时会触发,当前页码变化的处理
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.querycdt.pagenum = val
      this.getUseList()
    },
    // 展示数据
    async getUseList() {
      var { data: dt } = await this.$http.get('orders', {
        params: this.querycdt
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.userList = dt.data.goods
      // this.querycdt.pagenum = dt.pagenum
      this.tot = dt.data.total
      //   console.log(this.userLiwuliuDialogVisiblest)
    }
  },
  data() {
    return {
      /* 物流弹出层 */
      wuliuList: [],
      wuliuDialogVisible: false,

      orderSearch: '',

      tot: 0, // 总数据条数
      userList: [], // 用户列表数据
      // 分页
      querycdt: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页显示信息条数
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
