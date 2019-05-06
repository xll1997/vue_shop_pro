<template>
  <div>
    <com-crumb nm="分类"/>

    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="addCatDialog" width="50%" @close="resetAddFrom">
      <el-form :rules="addCatRules" :model="addCatForm" ref="addCatRef" label-width="120px">
        <el-form-item label="活动名称:" prop="cat_name">
          <el-input v-model="addCatForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类上级:">
          <el-cascader
            expand-trigger="hover"
            :options="catTwoList"
            :props="catTwoProps"
            v-model="catTwoSelected"
            @change="catTwoChange"
            change-on-select
            clearable
            style="width:100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatDialog = false">取 消</el-button>
        <el-button type="primary" @click="tianjia()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="showAddCatForm()">添加分类</el-button>

      <!-- 绘制表格 -->
      <el-table :data="CatList" style="width: 100%" :stripe="true" row-key="cat_id">
        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column prop="cat_level" label="排序" width="300">
          <template slot-scope="info">
            <el-tag v-if="info.row.cat_level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="info.row.cat_level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <!-- 分配角色 -->
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCatList()
  },
  methods: {
    // 添加分类
    // 关闭表单重置
    resetAddFrom() {
      // 重置名称
      this.$refs.addCatRef.resetFields()
      // 分类上级重置
      this.catTwoSelected = []
      // 重置form表单数据
      this.addCatForm.cat_pid = 0
      this.addCatForm.cat_level = 0
    },
    // 点击添加
    tianjia() {
      this.$refs.addCatRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.post(
            'categories',
            this.addCatForm
          )
          // console.log(dt)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.addCatDialog = false
          this.getCatList()
        }
      })
    },
    // 级联选择器回调函数处理
    catTwoChange() {
      // 获取id长度
      var len = this.catTwoSelected.length
      if (len === 0) {
        // 没有选取上级分类
        this.addCatForm.cat_pid = 0
        this.addCatForm.cat_level = 0
      } else {
        // 有选取的上级
        this.addCatForm.cat_pid = this.catTwoSelected[len - 1]
        this.addCatForm.cat_level = len
      }
      // console.log(this.addCatForm)
    },
    async showAddCatForm() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.catTwoList = dt.data
      this.addCatDialog = true
    },

    // 获取分类列表数据
    async getCatList() {
      const { data: dt } = await this.$http.get('categories', {
        params: this.querycdt
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.CatList = dt.data.result
    }
  },
  data() {
    return {
      // 添加分类
      addCatRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      catTwoProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      catTwoSelected: [],
      catTwoList: [],
      addCatDialog: false,
      addCatForm: {
        cat_name: '', // 新分类名称
        cat_pid: 0, // 新分类直接父id
        cat_level: 0 // 新分类的等级
      },
      // 显示表格
      CatList: [],
      querycdt: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
