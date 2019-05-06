<template>
  <!-- <div>用户列表管理</div> -->
  <div>
    <com-crumb nm="商品"/>

    <el-card class="box-card">
      <!-- 搜索框 -->
      <!--
        :gutter="20" 设置每个el-col的彼此间隔
        :span=xx 设置每个el-col占据的宽度
      -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            class="input-with-select"
            clearable
            @clear="getUseList"
            @keyup.enter.native="getUseList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUseList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addNewShop()">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 绘制表格 -->
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="130"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="130"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200">
          <template slot-scope="info">
            <span>{{ info.row.add_time|dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width="130">
          <template slot-scope="info">
            <!-- 修改商品信息按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="userDelete(info.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getUseList()
  },
  data() {
    return {
      tot: 0, // 总数据条数
      userList: [], // 用户列表数据
      // 分页
      querycdt: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页显示信息条数
      }
    }
  },
  methods: {
    // 添加新商品
    addNewShop() {
      this.$router.push('/goodsadd')
    },
    // 删除用户
    userDelete(id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除', {
        confirmButtonText: '确定', // 确定按钮文本内容
        cancelButtonText: '取消', // 取消文本按钮内容
        type: 'warning' // 消息类型，用于显示图标
      })
        .then(async() => {
          const { data: dt } = await this.$http.delete('goods/' + id)
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 提示信息
          this.$message.success(dt.meta.msg)
          // 小问题
          if (this.userList.length === 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--
          }
          // 刷新页面
          this.getUseList()
        })
        .catch(() => {})
    },
    // 重置表单
    addResetDialog() {
      this.$refs.addRuleForm.resetFields()
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
      var { data: dt } = await this.$http.get('goods', {
        params: this.querycdt
      })
      // console.log(dt.data)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.userList = dt.data.goods
      // this.querycdt.pagenum = dt.pagenum
      this.tot = dt.data.total
    }
  }
}
</script>

<style lang="less" scoped>
</style>
