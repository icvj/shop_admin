<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="logout">
        欢迎光临
        <a href="javascript:;" @click='logout'>退出</a>
      </div>
      <div class="title">
        <h3>电商后台管理系统</h3>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path.split('-')[0]"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router>
          <el-submenu v-for="submenu in menuList" :key="submenu.id" :index="submenu.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{submenu.authName}}</span>
            </template>
            <el-menu-item v-for="item in submenu.children" :key="item.id" :index="'/' + item.path">
              <i class="el-icon-menu"></i>
              {{item.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    logout() {
      this.$confirm('退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  },
  async created() {
    let res = await this.axios.get('menus')
    // console.log(res)
    let { data, meta: { status } } = res.data
    if (status === 200) {
      this.menuList = data
    }
  }
}
</script>

<style lang='less' scoped>
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;

    .logo {
      float: left;
      width: 180px;
      height: 60px;

      background: url('../assets/logo.png') no-repeat center center;
      background-size: contain;
    }

    .title {
      overflow: hidden;
      text-align: center;
      line-height: 60px;
      height: 60px;
      font-weight: bold;
      color: #fff;
      font-size: 24px;
    }

    .logout {
      float: right;
      width: 180px;
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      text-align: right;
      a {
        color: #f80;
      }
    }
  }
  .el-aside {
    background-color: rgb(84, 92, 100);

    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
