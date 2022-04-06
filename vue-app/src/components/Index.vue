<template>
  <div class="container">
    <!-- 首页顶部 -->
    <el-container class="container">
      <el-header
        ><el-row>
          <el-col :span="3"
            ><div class="grid-content bg-purple">
              {{ this.$store.getters.getUser.username }}, 欢迎登录
            </div></el-col
          >
          <el-col :span="19"
            ><div class="grid-content bg-purple-light">
              <font>电商后台管理系统</font>
            </div></el-col
          >
          <el-col :span="2"
            ><div class="grid-content bg-purple">
              <el-button type="primary" plain @click="exitLogin"
                >退出登录</el-button
              >
            </div></el-col
          >
        </el-row></el-header
      >

      <el-container>
        <!-- 首页侧边栏 -->
        <el-aside width="200px">
          <!-- 用户管理模块 -->
          <!-- 设置router的值为true   按照index的值进行路由跳转 -->

          <el-menu unique-opened :router="true" class="el-menu-vertical-demo">
            <el-submenu
              v-for="item in menusList"
              :key="item.id"
              :index="item.id.toString()"
            >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item
                v-for="item2 in item.children"
                :key="item2.id"
                :index="item2.path"
              >
                <i class="el-icon-menu"></i>
                {{ item2.authName }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 首页内容栏 -->
        <!-- 利用嵌套路由对主页内容进行切换 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      // msg: "你好，",
      router: true,
      openMenu: true,
      menusList: [],
    };
  },
  methods: {
    // 退出登录
    exitLogin() {
      // localStorage.clear();清除所有的值
      // 清除指定的值
      localStorage.removeItem("token");
      this.$message({
        message: "成功退出登录",
        type: "success",
      });
      // 点击退出登录按钮  清空localstorage里面的值  并且跳转至登录页面重新登录
      this.$router.push({ path: "/login" });
      // location.reload(); 重新加载本页面   在本界面渲染之前有钩子函数对token进行验证

      // 退出登录后  清楚session数据缓存
      sessionStorage.clear();
    },
  },

  // 在首页渲染前  检查用户是否携带了token
  // 如果没有携带token   跳转到登录页面
  mounted() {
    // 在首页进行渲染之前，如果在localStorage中没有检查到存在token，那么需要跳转至登录页面
    if (!localStorage.getItem("token")) {
      this.$router.push({ path: "/login" });
      // element-ui提供的方法
      this.$message({
        message: "请先进行登录",
        type: "warning",
      });
    } else {
      this.$axios({
        url: "menus",
        method: "get",
      }).then((backData) => {
        // console.log(backData);
        this.menusList = backData.data.data;
        // location.reload();
      });
    }

    /* else {
      // 测试用户携带正确的token令牌能否发起业务请求
      this.$axios({
        url: "users?pagenum=1&pagesize=6",
        method: "get",
        // 设置http请求头{key，value}
      }).then((backData) => {
        // console.log(backData);
      });
    } */
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-aside {
  background-color: white;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
font {
  font-size: 30px;
  font-weight: bolder;
}
</style>
