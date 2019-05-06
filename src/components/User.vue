<template>
  <!-- <div>用户列表管理</div> -->
  <div>
    <com-crumb nm="用户"/>

    <!-- 用户分配角色 -->
    <el-dialog
      title="用户分配角色"
      :visible.sync="setRoleDialog"
      width="50%"
      @close="$refs.setRoleRef.resetFields()"
    >
      <el-form :rules="setRoleRules" :model="setRole" ref="setRoleRef" label-width="120px">
        <el-form-item label="当前用户:" prop="username">{{ setRole.username }}</el-form-item>
        <el-form-item label="当前角色:" prop="role_name">{{ setRole.role_name }}</el-form-item>
        <el-form-item label="分配新角色:" prop="rid">
          <el-select v-model="setRole.rid" placeholder="请选择">
            <!-- label: 分组的别名 value: 选项的值 -->
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeDialog = false">取 消</el-button>
        <el-button type="primary" @click="fenRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加新成员 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addResetDialog">
      <el-form :model="adduse" :rules="addUseRules" ref="addRuleForm">
        <el-form-item label="用户名" :label-width="addFormWidth" prop="username">
          <el-input v-model="adduse.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="addFormWidth" prop="password">
          <el-input v-model="adduse.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="addFormWidth" prop="email">
          <el-input v-model="adduse.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="addFormWidth" prop="mobile">
          <el-input v-model="adduse.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
        <el-button type="primary" @click="addUserList">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="$refs.editRuleForm.resetFields()"
    >
      <el-form :model="edituse" :rules="editUseRules" ref="editRuleForm">
        <el-form-item label="用户名" :label-width="addFormWidth" prop="username">
          <el-input v-model="edituse.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="addFormWidth" prop="email">
          <el-input v-model="edituse.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="addFormWidth" prop="mobile">
          <el-input v-model="edituse.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
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
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 绘制表格 -->
      <el-table :data="userList" border style="width: 100%">
        <!-- <el-table-column prop="pagenum" label="序号" width="60"></el-table-column> -->
        <el-table-column type="index" width="60" label="序号"></el-table-column>
        <el-table-column prop="username" label="用户名" width="160"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="130"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="60">
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="stateChange(info.row, info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="info">
            <!-- 修改用户信息按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUserList(info.row.id)"
            ></el-button>
            <!-- 删除用户按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="userDelete(info.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRole(info.row)"
              ></el-button>
            </el-tooltip>
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
  // 生命周期函数
  created() {
    this.getUseList()
  },
  data() {
    var validateMobile = (rule, value, callback) => {
      // value被校验的数据
      // 校验的回调函数，校验无论成功失败都执行
      var reg = /^1[356789]\d{9}$/
      if (!reg.test(value)) {
        return callback(new Error('手机号码格式不正确'))
      }
      callback()
    }
    return {
      tot: 0, // 总数据条数
      userList: [], // 用户列表数据
      // 分页
      querycdt: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前页码
        pagesize: 2 // 每页显示信息条数
      },
      dialogVisible: false, // 添加用户相关
      editdialogVisible: false, // 修改用户信息
      // 用户添加
      adduse: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户
      edituse: {
        username: '',
        email: '',
        mobile: ''
      },
      addFormWidth: '100px',
      // 修改表单验证
      editUseRules: {
        mobile: [
          { validator: validateMobile, trigger: 'blur' },
          {
            required: true,
            message: '手机号必填',
            trigger: 'blur'
          }
        ]
      },
      // 添加表单验证
      addUseRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' },
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }
        ]
      },
      // 分配角色
      setRoleDialog: false,
      setRoleRules: {
        rid: [
          { required: true, message: '必须选择一个角色', trigger: 'change' }
        ]
      }, // 表单验证
      setRole: {
        username: '',
        role_name: '',
        // 选中角色用此数据接收
        rid: 0
      }, // 表单数据
      roleList: [] // 用于分配的角色数据
    }
  },
  methods: {
    // 修改用户状态
    async stateChange(user, state) {
      const { data: dt } = await this.$http.put(
        `users/${user.id}/state/${state}`
      )
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.$message.success(dt.meta.msg)
    },
    // 分配角色
    // 发送数据
    fenRights() {
      this.$refs.setRoleRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.put(
            `users/${this.setRole.id}/role`,
            {
              rid: this.setRole.rid
            }
          )
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          this.setRoleDialog = false
          this.getUseList()
        }
      })
    },
    // 展示分配表单
    async showSetRole(user) {
      // console.log(user)
      const { data: dt } = await this.$http.get('roles')
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.roleList = dt.data
      this.setRole = user
      this.setRoleDialog = true
    },
    // 删除用户
    userDelete(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除', {
        confirmButtonText: '确定', // 确定按钮文本内容
        cancelButtonText: '取消', // 取消文本按钮内容
        type: 'warning' // 消息类型，用于显示图标
      })
        .then(async() => {
          const { data: dt } = await this.$http.delete('users/' + id)
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
      var { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      // console.log(dt.data)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.userList = dt.data.users
      // this.querycdt.pagenum = dt.pagenum
      this.tot = dt.data.total
    },
    // 添加新用户
    addUserList() {
      // 表单验证
      this.$refs.addRuleForm.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.post('/users', this.adduse)
          // console.log(dt)
          if (dt.meta.status !== 201) {
            return this.$message.error('添加用户失败...')
          }
          this.dialogVisible = false
          this.$message.success(dt.meta.msg)
          this.getUseList()
        } else {
          return false
        }
      })
    },
    // 修改用户信息
    editUser() {
      // 表单验证
      this.$refs.editRuleForm.validate(async valid => {
        if (valid) {
          console.log(this.edituse)
          const { data: dt } = await this.$http.put(
            '/users/' + this.edituse.id,
            this.edituse
          )
          console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.editdialogVisible = false
          this.$message.success(dt.meta.msg)
          this.getUseList()
        } else {
          return false
        }
      })
    },
    async editUserList(id) {
      const { data: dt } = await this.$http.get('users/' + id)
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.edituse = dt.data
      // console.log(this.edituse)
      this.editdialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
