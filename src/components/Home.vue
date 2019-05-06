<template>
  <div class="home">
    <!-- <p>后台首页面</p> -->
    <!-- container布局容器 -->
    <el-container>
      <el-header>
        <!-- Header -->
        <div class="logo-box">
          <img src="../assets/img/heima.png" alt>
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout()">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isShow  ? '65px' : '200px'">
          <el-col :span="12">
            <!-- <h5>自定义颜色</h5> -->
            <div class="toggle_bar" @click="isShow=!isShow">|||</div>
            <el-menu
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409EFF"
              :unique-opened="true"
              :collapse="isShow"
              :collapse-transition="false"
              @select="handleSelect"
              :router="true"
            >
              <el-submenu
                :index="item.id + ''"
                :style="{width: isShow?'65px':'200px'}"
                v-for="(item,k) in meunList"
                :key="item.id"
              >
                <template slot="title">
                  <i :class="'iconfont icon-' + iconList[k]"></i>
                  <span>{{ item.authName }}</span>
                </template>
                <el-menu-item
                  :index="item2.path"
                  v-for="item2 in item.children"
                  :key="item2.id"
                >
                  <i class="el-icon-menu"></i>
                  <span>{{ item2.authName }}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  // 生命周期函数
  created() {
    this.getMenuList()
  },
  data() {
    return {
      isShow: false,
      meunList: [],
      iconList: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  },
  methods: {
    // 右边栏数据展示
    async getMenuList() {
      var { data: dt } = await this.$http.get('menus')
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.meunList = dt.data
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
    },
    // 退出系统
    logout() {
      this.$confirm('确定退出系统?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {
        })
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
}
.el-header {
  background-color: #373d41;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  padding-right: 20px;
  .logo-box {
    // line-height: 60px;
    display: flex;
    align-items: center;
    font-size: 22px;
    color: #fff;
    // 设置或检索是否允许用户选中文本
    user-select: none;
    img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
  }
}
.el-container {
  height: 100%;
  .el-aside {
    background-color: #333744;
    .toggle_bar {
      background-color: #4a5064;
      text-align: center;
      color: #fff;
      height: 25px;
      font-size: 12px;
      line-height: 25px;
      user-select: none;
      cursor: pointer;
      letter-spacing: 0.1em;
    }
    .el-col-12 {
      width: 100%;
      .el-menu {
        width: 100%;
      }
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
