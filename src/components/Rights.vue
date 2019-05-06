<template>
  <div>
    <com-crumb nm="权限"/>
    <el-card class="box-card">
      <!-- 绘制表格 -->
      <el-table :data="rightsList" border style="width: 100%">
        <!-- <el-table-column prop="pagenum" label="序号" width="60"></el-table-column> -->
        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="200"></el-table-column>
        <el-table-column prop="path" label="路径" width="200"></el-table-column>
        <el-table-column prop="pid" label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="info.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightList()
  },
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightList() {
      const { data: dt } = await this.$http.get('rights/list')
      //   console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.rightsList = dt.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
