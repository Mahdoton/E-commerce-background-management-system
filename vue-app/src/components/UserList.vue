<template>
  <div>
    <!-- 面包屑栏 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="background: white; line-height: 40px; padding-left: 20px"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框栏 -->
    <div
      style="
        margin-top: 10px;
        line-height: 0px;
        width: 600px;
        padding-left: 0px;
      "
    >
      <el-input
        v-model="searchUserInfo"
        placeholder="请输入内容"
        class="input-with-select"
        style="width: 400px; margin-left: -100px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchUser"
        ></el-button>
      </el-input>
      <el-button type="success" plain @click="showDialogForm"
        >添加用户</el-button
      >
    </div>

    <!-- 用户列表表格展示栏 -->
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column property="username" label="用户名" width="120">
      </el-table-column>
      <el-table-column property="email" label="邮箱" width="120">
      </el-table-column>
      <el-table-column property="mobile" label="电话"> </el-table-column>
      <el-table-column label="用户状态">
        <!-- 给开关按钮用template标签围起来  并且添加slot-scope属性  值可以任意取 -->
        <!-- 通过scope.row可以获取每一个用户的所有信息   是一个对象 -->
        <!-- 通过scope.$index可以获取每一个用户对象在数组中的下标 -->
        <template slot-scope="scope">
          <!-- 开关按钮中有专门的开关状态改变事件change -->
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="scope.row.mg_state"
            @change="editUserState(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑用户信息按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditUserInfo(scope.row)"
            ></el-button>
            <!-- 分配用户角色按钮 -->
            <el-button
              type="success"
              icon="el-icon-check"
              circle
              @click="isDistributeUserRole(scope.row)"
            ></el-button>
            <!-- 删除用户信息按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteUser(scope.row.id)"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加用户信息的子页面弹窗 -->
    <el-dialog title="添加用户" :visible.sync="addUserFormVisible">
      <el-form v-bind:model="addUserData" v-bind:rules="userRules">
        <el-form-item label="用户名" prop="username">
          <el-input
            autocomplete="off"
            v-model="addUserData.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            autocomplete="off"
            v-model="addUserData.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input autocomplete="off" v-model="addUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input autocomplete="off" v-model="addUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户信息的子页面弹窗 -->
    <el-dialog title="编辑用户" :visible.sync="editUserFormVisible">
      <el-form v-bind:model="editUserData">
        <el-form-item label="用户名">
          <el-input
            autocomplete="off"
            v-model="editUserData.username"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="邮箱">
          <el-input autocomplete="off" v-model="editUserData.email"></el-input>
        </el-form-item> </el-form
      ><el-form>
        <el-form-item label="电话">
          <el-input autocomplete="off" v-model="editUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配用户角色的子页面弹窗 -->
    <el-dialog title="分配角色" :visible.sync="editRolesFormVisible">
      <div class="myDiv">
        <span>当前用户：</span><span>{{ username }}</span>
      </div>
      <div>
        <span>请选择角色：</span>
        <el-select v-model="value" placeholder="请选择" @change="valueChange">
          <el-option
            v-for="item in roleData"
            :key="item.rid"
            :label="item.roleName"
            :value="item.rid"
          >
          </el-option>
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRolesFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="distributeUserRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页栏 -->
    <template>
      <div class="block">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :page-sizes="[10, 20]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="20"
        >
        </el-pagination>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleData: [],
      value: "",

      // tableData为一个数组  数组中有许多对象  对象中的key要与表格中property属性的值一一对应
      tableData: [],
      // 添加用户弹窗的用户数据
      addUserData: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 修改用户弹窗的用户数据
      editUserData: {
        id: "",
        username: "",
        email: "",
        mobile: "",
      },
      // 搜索框的数据
      searchUserInfo: "",
      // 控制  添加用户  弹出窗口
      addUserFormVisible: false,
      // 控制  编辑用户  弹出窗口
      editUserFormVisible: false,
      // 控制  编辑用户角色  弹出窗口
      editRolesFormVisible: false,
      // 对用户输入的用户名和密码进行初步表单验证
      // formRlues与整个表单绑定的rules属性是一致的名字
      userRules: {
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

      // 保存当前页码和每页数据条数
      pageNum: "1",
      pageSize: "10",

      // 保存角色id
      id: "",
      rid: "",
      username: "",
    };
  },
  methods: {
    //获取用户列表信息并渲染到表格中  给定一个默认查询参数  一个函数可以完成查询与展示全部用户数据功能
    getUserAll(search = "") {
      var url;
      if (search != "") {
        url = `users?pagenum=${this.pageNum}&pagesize=${this.pageSize}&query=${search}`;
      } else {
        url = `users?pagenum=${this.pageNum}&pagesize=${this.pageSize}`;
      }
      this.$axios({
        url,
        method: "get",
        // 设置http请求头{key，value}
        // headers: { Authorization: localStorage.getItem("token") },
      }).then((backData) => {
        // console.log(backData);
        this.tableData = backData.data.data.users;
      });
    },
    // 用户通过搜索框进行模糊查询
    searchUser() {
      this.getUserAll(this.searchUserInfo);
    },
    // 添加用户弹窗
    showDialogForm(userInfo) {
      this.addUserFormVisible = true;
    },
    // 添加用户信息
    addUserInfo() {
      this.$axios({
        url: "users",
        method: "post",
        // headers: { Authorization: localStorage.getItem("token") },
        data: this.addUserData,
      }).then((backData) => {
        // console.log(backData);
        if (backData.data.meta.status == 201) {
          this.$message({
            message: backData.data.meta.msg,
            type: "success",
          });
          this.addUserFormVisible = false;
        } else {
          this.$message.error(backData.data.meta.msg);
        }
        this.getUserAll();
      });
    },
    // 修改用户状态
    editUserState(userData) {
      // alert(dd);
      this.$axios({
        url: `users/${userData.id}/state/${userData.mg_state}`,
        method: "put",
        // headers: { Authorization: localStorage.getItem("token") },
      }).then((backData) => {
        // console.log(backData);
        if (backData.data.meta.status == 200) {
          this.$message({
            message: backData.data.meta.msg,
            type: "success",
          });
        } else {
          this.$message.error(backData.data.meta.msg);
        }
      });
    },
    // 删除用户信息   删除前进行用户确认
    deleteUser(userId) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            url: `users/${userId}`,
            method: "delete",
            // headers: { Authorization: localStorage.getItem("token") },
          }).then((backData) => {
            // console.log(backData);
            if (backData.data.meta.status == 200) {
              this.$message({
                message: backData.data.meta.msg,
                type: "success",
              });
              this.getUserAll();
            } else {
              this.$message.error(backData.data.meta.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 显示分配用户角色弹窗
    isDistributeUserRole(userInfo) {
      this.editRolesFormVisible = true;
      // console.log(userInfo);
      // username用于弹窗展示数据
      this.username = userInfo.username;
      // id存储起来为后续分配用户角色提供参数
      this.id = userInfo.id;
      this.$axios({
        url: `roles`,
        method: "get",
      }).then((backData) => {
        // console.log(backData);
        this.roleData = backData.data.data;
        // console.log(this.roleData);
      });
    },

    // 当下拉框选中角色的值发生改变时   更新vue中存储的rid值
    valueChange(currentValue) {
      // console.log(currentValue);
      this.rid = currentValue;
    },

    // 分配用户角色
    distributeUserRole() {
      // console.log(this.id);
      // console.log(this.rid);
      // 向服务器发送分配用户角色请求
      this.$axios({
        url: `users/${this.id}/role`,
        method: "put",
        data: {
          rid: this.rid,
        },
      }).then((backData) => {
        // console.log(backData)
        if (backData.data.meta.status == 200) {
          this.$message({
            message: backData.data.meta.msg,
            type: "success",
          });
          this.editRolesFormVisible = false;
        } else {
          this.$message.error(backData.data.meta.msg);
        }
      });
    },
    // 显示编辑用户信息的窗口并渲染
    showEditUserInfo(userInfo) {
      this.editUserFormVisible = true;
      // console.log(userInfo);
      // 将id保存到vue中  便于editUserInfo()向服务器提供id参数进行请求
      this.editUserData.id = userInfo.id;
      this.editUserData.username = userInfo.username;
      this.editUserData.email = userInfo.email;
      this.editUserData.mobile = userInfo.mobile;
    },
    // 提交编辑之后的用户信息给服务器
    editUserInfo() {
      // console.log(this.editUserData.id);
      this.$axios({
        url: `users/${this.editUserData.id}`,
        method: "put",
        // put请求其他参数可以写在data上
        data: {
          email: this.editUserData.email,
          mobile: this.editUserData.mobile,
        },
      }).then((backData) => {
        console.log(backData);
        if (backData.data.meta.status == 200) {
          this.$message({
            message: backData.data.meta.msg,
            type: "success",
          });
          this.editUserFormVisible = false;
          this.getUserAll();
        } else {
          this.$message.error(backData.data.meta.msg);
        }
      });
    },
    // 当前页码发生改变时  重新获取用户列表
    currentChange(pageNum) {
      // 更新每页条数
      this.pageNum = pageNum;
      // console.log(pageSize)  20
      // 重新向服务器发起请求
      this.$axios({
        url: `users?pagenum=${this.pageNum}&pagesize=${this.pageSize}`,
        method: "get",
        // 设置http请求头{key，value}
        // headers: { Authorization: localStorage.getItem("token") },
      }).then((backData) => {
        // console.log(backData);
        // 更新表格绑定的值
        this.tableData = backData.data.data.users;
      });
    },
    // 每页条数改变时  重新获取用户列表
    sizeChange(pageSize) {
      // 更新每页条数
      this.pageSize = pageSize;
      // console.log(pageSize)  20
      // 重新向服务器发起请求
      this.$axios({
        url: `users?pagenum=${this.pageNum}&pagesize=${this.pageSize}`,
        method: "get",
        // 设置http请求头{key，value}
        // headers: { Authorization: localStorage.getItem("token") },
      }).then((backData) => {
        // console.log(backData);
        // 更新表格绑定的值
        this.tableData = backData.data.data.users;
      });
    },
  },

  // 在页面加载之前渲染用户列表数据
  beforeMount() {
    this.getUserAll();
  },
};
</script>

<style>
.el-table__cell {
  line-height: 30px;
}
.el-table th.el-table__cell {
  text-align: center;
  border: 1px solid #ebeef5;
}
.el-table td.el-table__cell {
  border: 1px solid #ebeef5;
  text-align: center;
}
.el-pagination {
  text-align: left;
}
.el-select > .el-input {
  line-height: 1px;
}
.myDiv {
  line-height: 16px;
}
</style>