<template>
  <div>
    <!-- 面包屑导航 -->
    <com-crumb nm="商品"/>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 消息提示 -->
      <el-alert title="消息提示的文案" type="info" center show-icon></el-alert>

      <!-- 步骤条 -->
      <el-steps class="el-steps-titles" :active="activeName - 1" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form ref="goodsAddList" :model="adduse" :rules="addUseRules" label-width="100px">
        <!-- tabs标签页 -->
        <el-tabs
          class="tabsH"
          v-model="activeName"
          tab-position="left"
          @tab-click="handleClick()"
          :before-leave="beforeTab"
        >
          <!-- 基本信息 -->
          <el-tab-pane name="1" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="adduse.goods_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="adduse.goods_price" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="adduse.goods_weight" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="adduse.goods_number" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="ParamList"
                :props="ParamProps"
                v-model="ParamSelected"
                @change="catChange()"
                change-on-select
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane name="2" label="商品参数">
            <el-form-item :label="item.attr_name" v-for="(item,k) in manyParams" :key="k">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item2" border v-for="(item2,j) in item.attr_vals" :key="j"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane name="3" label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,k) in onlyParams"
              :key="k"
              label-width="150px"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane name="4" label="商品图片">
            <el-upload
              action="http://127.0.0.1:11333/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane name="5" label="商品内容">
            <!-- 富文本 -->
            <quill-editor class="editor" v-model="adduse.goods_introduce"></quill-editor>
            <!-- 按钮 -->
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 局部引入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  created() {
    this.getParamsList()
    // this.handleClick()
  },
  components: {
    quillEditor
  },
  methods: {
    /* tab生效之前的函数 */
    beforeTab(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName)

      if (oldActiveName === '1' && this.ParamSelected.length !== 3) {
        // 提示框:提示选择三级分类
        this.$message({
          message: '请选取第三级商品分类',
          type: 'error',
          duration: 1500
        })
        return false
      }
    },
    /* 商品内容 */
    async addGoods() {
      // this.$refs.goodsAddList.validate(valid => {
      // if (valid) {
      // 商品分类
      this.adduse.goods_cat = this.ParamSelected.join(',')
      // console.log(this.adduse)

      // 动态数组
      this.manyParams.forEach((item, i) => {
        if (item.attr_vals.length > 0) {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.adduse.attrs.push(obj)
        }
      })

      // 静态数组
      this.onlyParams.forEach((item, i) => {
        if (item.attr_vals.length > 0) {
          let obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.adduse.attrs.push(obj)
        }
      })

      // console.log(this.adduse)
      // }
      // })
      const { data: dt } = await this.$http.post('/goods', this.adduse)
      // console.log(dt)
      if (dt.meta.status !== 201) {
        this.$message.error(dt.meta.msg)
        return false
      }
      this.$router.push('/goods')
    },

    /* 图片上传 */
    // 文件已上传的钩子
    handlePreview() {},
    // 文件列表移除时的钩子
    handleRemove(file) {
      const tmp_path = file.response.data.tmp_path
      // console.log(file)
      // console.log(this.adduse.pics)
      const index = this.adduse.pics.findIndex((item, i) => {
        return item.pic === tmp_path
      })
      this.adduse.pics.splice(index, 1)
      console.log(this.adduse.pics)
    },
    // 文件上传成功的钩子
    handleSuccess(response) {
      // console.log(response)
      const tmp_path = response.data.tmp_path
      this.adduse.pics.push({
        pic: tmp_path
      })
      console.log(this.adduse.pics)
    },
    /* 基本信息 */
    async getParamsList() {
      const { data: dt } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.ParamList = dt.data
    },
    // 三级分类
    catChange() {
      this.threeCatId = this.ParamSelected[2]
      // console.log(this.threeCatId)
    },

    /* 商品参数 */
    async handleClick() {
      // console.log(this.activeName)
      // 获取动态数据
      if (this.activeName === '2') {
        const { data: dt } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          { params: { sel: 'many' } }
        )
        // console.log(dt)
        if (dt.meta.status !== 200) {
          return this.$message({
            message: '获取商品参数失败',
            type: 'error',
            duration: 1500
          })
        }
        dt.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
        })
        this.manyParams = dt.data
        // console.log(this.manyParams)
      }

      // 获取静态数据
      if (this.activeName === '3') {
        const { data: dt } = await this.$http.get(
          `categories/${this.threeCatId}/attributes`,
          { params: { sel: 'only' } }
        )
        // console.log(dt)
        if (dt.meta.status !== 200) {
          return this.$message({
            message: '获取商品参数失败',
            type: 'error',
            duration: 1500
          })
        }
        // dt.data.forEach(item => {
        //   item.attr_vals = item.attr_vals.split(',')
        // })
        this.onlyParams = dt.data
        // console.log(this.onlyParams)
      }
    }
  },
  data() {
    return {
      /* 基本信息 */
      ParamSelected: [],
      ParamList: [],
      ParamProps: {
        value: 'cat_id',
        label: 'cat_name'
        // children: 'children'
      },
      goods_cat: [],
      threeCatId: 0,
      manyParams: [], // 动态参数数据
      onlyParams: [], // 静态参数数据
      /* 图片 */
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },

      /* 页面初整理 */
      activeName: '1',
      adduse: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 添加表单验证
      addUseRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps-titles,
.el-tabs {
  margin-top: 15px;
}
.ql-container {
  min-height: 200px !important;
}
.ql-editor,
.ql-blank {
  min-height: 200px !important;
}
</style>
