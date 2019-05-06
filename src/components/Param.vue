<template>
  <div>
    <!-- 面包屑 -->
    <com-crumb nm="参数"/>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 警告区 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!-- 选择商品分类 -->
      <el-row>
        <el-col>
          选择商品分类:
          <el-cascader
            expand-trigger="hover"
            :options="ParamList"
            :props="ParamProps"
            v-model="ParamSelected"
            @change="ParamChange"
            change-on-select
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="tabsclick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="用户管理" :disabled="showButton" name="many">
          <el-button type="primary" size="mini" :disabled="showButton">添加动态参数</el-button>
          <!-- 绘制表格 -->
          <el-table :data="manyParamList" style="width: 100%" border>
            <el-table-column type="expand" width="50">
              <template slot-scope="info">
                <el-tag v-for="(v,k) in info.row.attr_vals_arr" :key="k" closable>{{v}}</el-tag>
                <!-- 添加可选值按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" width="100" label="序号"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="300">
              <!-- 分配角色 -->
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态参数 -->
        <el-tab-pane label="配置管理" :disabled="showButton" name="only">
          <el-button type="primary" size="mini" :disabled="showButton">添加静态参数</el-button>
          <!-- 绘制表格 -->
          <el-table :data="onlyParamList" style="width: 100%" border>
            <el-table-column type="expand" width="50">
              <template slot-scope="info">
                <el-tag v-for="(v,k) in info.row.attr_vals_arr" :key="k" closable>{{v.name}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" width="100" label="序号"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="300">
              <!-- 分配角色 -->
              <template>
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getParamsList()
    this.ParamChange()
  },
  methods: {
    // 添加可选值按钮
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      var inputValue = this.inputValue
      // console.log(this.manyParamList)
      // this.manyParamList.attr_vals_arr
      if (inputValue) {
        if (this.activeName === 'many') {
          this.manyParamList[0].attr_vals_arr.push(inputValue)
        } else {
          this.onlyParamList[0].attr_vals_arr.push(inputValue)
        }
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    // tabs标签页
    // tabs切换回调
    tabsclick() {
      this.getThreeParamsList()
    },
    // 封装对应参数数据列表
    async getThreeParamsList() {
      const { data: dt } = await this.$http.get(
        `categories/${this.threeId}/attributes`,
        { params: { sel: this.activeName } }
      )
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      dt.data.forEach(item => {
        item.attr_vals_arr = item.attr_vals.split(' ')
      })
      // console.log(dt.data[0].attr_vals_arr)
      // this.tagsAttr = dt.data.attr_vals_arr
      // console.log(this.tagsAttr)
      if (this.activeName === 'many') {
        this.manyParamList = dt.data
      } else {
        this.onlyParamList = dt.data
      }
    },
    // 选择商品分类
    async getParamsList() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      //   console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.ParamList = dt.data
    },
    // 当商品分类不在第三级别时，不显示列表
    ParamChange() {
      // console.log(this.ParamSelected)
      var len = this.ParamSelected.length
      if (len === 3) {
        this.showButton = false
        this.threeId = this.ParamSelected[len - 1]
        this.getThreeParamsList()
      } else {
        this.showButton = true
        this.ParamSelected = []
        this.manyParamList = []
        this.onlyParamList = []
      }
    }
  },
  data() {
    return {
      // 添加可选按钮
      inputVisible: false,
      inputValue: '',
      // tagsAttr: [], // 定义空数组
      // tabs标签页
      threeId: 0,
      manyParamList: [],
      onlyParamList: [],
      showButton: false,
      activeName: 'many', // 绑定值，选中选项的name值
      // 选择商品分类
      ParamList: [],
      ParamProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      ParamSelected: []
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin: 15px;
}
.el-tag {
  margin: 10px 5px;
}
</style>
