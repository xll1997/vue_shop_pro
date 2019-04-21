<template>
  <div id="login-container">
    <!-- <h2>管理员登录系统</h2> -->
    <div id="login-box">
      <div id="logo-box">
        <img src="../assets/img/logo.png" alt>
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-yonghu"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :offset="15">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="info">重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123465'
      },
      loginFormRules: {
        username: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '请输入用户名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '请输入密码', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$router.push('/home')
      // console.log(this)
    }
  }
}
</script>
<style lang="less" scoped>
#login-container {
  height: 100%;
  background-color: #2b4b6b;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    #logo-box {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      padding: 8px;
      border: 1px solid #eee;
      position: absolute;
      box-shadow: 0 0 10px #eee;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form {
      padding: 20px;
      width: 100%;
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
      // .el-form-item {
      //   margin-bottom: 0;
      //   .el-input {
      //     padding-bottom: 20px;
      //   }
      // }
    }
  }
}
</style>
