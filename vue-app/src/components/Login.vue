<template>
  <!-- 对整个form表单进行绑定 表单内部所有地值都来自model属性中的form对象（来自data当中） -->
  <div class="login-wrap">
    <el-form
      v-bind:rules="formRules"
      v-bind:model="form"
      ref="form"
      label-width="80px"
      class="login-form"
    >
      <h2>管理员登录</h2>
      <el-form-item label="用户名" prop="username">
        <!-- 需要对input框进行双向数据绑定才能够输入内容 -->
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label-position="top" label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="onLogin"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },

      // 对用户输入的用户名和密码进行初步表单验证
      // formRlues与整个表单绑定的rules属性是一致的名字
      formRules: {
        // 验证的对象必须在data中能够找到并且名字一一对应
        // 用户名验证规则
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        // 密码验证规则
        password: [
          { required: true, message: "密码不能为空·", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "长度在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    onLogin() {
      // 点击登录按钮，给服务器发送post登录请求
      // 根据服务器返回的信息进行弹框提醒
      this.$axios.post("login", this.form).then((backData) => {
        // console.log(backData);
        if (backData.data.meta.status === 200) {
          this.$message({
            message: backData.data.meta.msg,
            type: "success",
          });
          // 将token令牌保存下来 localStorage .setItem(key,value)
          localStorage.setItem("token", backData.data.data.token);

          // 登录成功之后  跳转至项目主页面
          // 编程式导航进行路由跳转
          this.$router.push({ path: "/" });
        } else if (backData.data.meta.status === 400) {
          this.$message.error(backData.data.meta.msg);
        }
        // 改变store中的state状态
        this.$store.dispatch("asyncUpdateUser", {
          username: this.form.username,
        });
        // 设置session
        sessionStorage.setItem('state',JSON.stringify(this.$store.state));
      });
    },
  },
};
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
}
.login-wrap .login-form .login-btn {
  width: 100%;
}
h2 {
  text-align: center;
}
</style>