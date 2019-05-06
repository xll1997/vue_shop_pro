<template>
  <div>
    <com-crumb nm="角色"/>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="distributeDialog" width="50%">
      <el-form :model="distributeForm" ref="distributeForm" label-width="120px">
        <el-form-item label="当前角色:">{{ distributeForm.roleName }}</el-form-item>
        <el-form-item label="分配的权限:">
          <!-- 分配的权限树 -->
          <el-tree
            :data="rightInfo"
            show-checkbox
            :default-expand-all="true"
            node-key="id"
            :props="treeProps"
            :default-checked-keys="defaultChecked"
            ref="treeRef"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeDialog = false">取 消</el-button>
        <el-button type="primary" @click="fenRights">确 定</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <!-- 绘制表格 -->
      <el-table :data="roleList" border style="width: 100%">
        <!-- 设置展开行内容 -->
        <el-table-column type="expand">
          <template slot-scope="info">
            <!-- 第一级别权限遍历 -->
            <el-row
              v-for="(v,k) in info.row.son"
              :key="v.id"
              :style="{'border-bottom': '1px solid rgb(235, 238, 245)', 'border-top':k===0 ? '1px solid rgb(235, 238, 245)':''}"
            >
              <el-col :span="5">
                <el-tag closable @close="delRights(info.row, v.id)">{{ v.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 第二级别权限遍历 -->
                <el-row
                  v-for="(vv,kk) in v.children"
                  :key="vv.id"
                  :style="{'border-top': kk!==0 ? '1px solid rgb(235, 238, 245)' : ''}"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="delRights(info.row, vv.id)"
                    >{{ vv.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="vvv in vv.children"
                      :key="vvv.id"
                      closable
                      type="warning"
                      @close="delRights(info.row, vvv.id)"
                    >{{ vv.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column type="index" width="100" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
        <el-table-column label="操作" width="300">
          <!-- 分配角色 -->
          <template slot-scope="info">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showDistributeDialog(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList()
  },
  methods: {
    // 分配权限树
    // 收集分配的权限存入仓库
    async fenRights() {
      // 获取全选的id
      var ids1 = this.$refs.treeRef.getCheckedKeys()
      // 获取半选的id
      var ids2 = this.$refs.treeRef.getHalfCheckedKeys()
      var ids12 = ids1.concat(ids2).join(',')
      // console.log(ids12)
      const { data: dt } = await this.$http.post(
        `roles/${this.distributeForm.id}/rights`,
        { rids: ids12 }
      )
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
      this.distributeDialog = false
      this.getRoleList()
    },
    // 显示分配角色弹出框
    async showDistributeDialog(role) {
      const { data: dt } = await this.$http.get('rights/tree')
      // console.log(role)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.rightInfo = dt.data
      // 接收第三级别权限id
      var idKeys = []
      // 递归遍历第三级别权限
      this.getHaveRights(role, idKeys)
      // console.log(idKeys)
      this.defaultChecked = idKeys

      this.distributeForm = role
      this.distributeDialog = true
      // console.log(role)
    },
    // 递归遍历第三级别权限
    getHaveRights(node, arr) {
      // 给node第一维设置children字段
      if (node.son) {
        node.children = node.son
      }
      // 如果是第三级别权限，就把其id给到arr里
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果是1/2级别权限就遍历其children，继续挖掘内部节点
      node.children.forEach(item => {
        this.getHaveRights(item, arr)
      })
    },

    // 点击叉号删除已有权限
    delRights(role, rightsId) {
      // role 角色id
      // rightsId 被删除权限的id
      this.$confirm('确定删除此权限?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: dt } = await this.$http.delete(
            `roles/${role.id}/rights/${rightsId}`
          )
          //   console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          role.son = dt.data
        })
        .catch(() => {})
    },
    // 显示表格数据
    async getRoleList() {
      const { data: dt } = await this.$http.get('roles')
      //   console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      dt.data.forEach(element => {
        element.son = element.children
        delete element.children
      })
      this.roleList = dt.data
    }
  },
  data() {
    return {
      // 权限数据
      roleList: [],
      // 弹出框
      distributeDialog: false,
      // 表单数据对象
      distributeForm: {
        id: 0, // 角色id
        roleDesc: '', // 角色描述
        roleName: '' // 角色名称
      },
      // 权限树
      defaultChecked: [], // 角色拥有权限集合
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 定义被选取的数据成员
      rightInfo: []
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px 5px;
}
</style>
