<template>
  <div>
    <!-- 面包屑栏 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="background: white; line-height: 40px; padding-left: 20px"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色栏 -->
    <div style="margin-top: 10px; line-height: 0px; width: 600px">
      <el-button type="success" class="mybtn" @click="isAddRole"
        >添加角色</el-button
      >
    </div>

    <!-- 角色列表表格展示栏 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <!-- 对展开栏做三层循环  展开三级权限列表 -->
        <template slot-scope="props">
          <!-- 三级权限列表的循环逻辑 -->
          <!-- {{props.row}} -->
          <!-- <div >
              <ul v-for="(value1, key1) in props.row.children" v-bind:key="key1">
                <li >{{ value1.authName }}</li>
                <ul v-for="(value2, key2) in value1.children" v-bind:key="key2">
                  <li>{{ value2.authName }}</li>
                  <ul v-for="(value3, key3) in value2.children" v-bind:key="key3">
                    <li>{{ value3.authName }}</li>
                  </ul>
                </ul>
              </ul>
            </div> -->
          <div>
            <el-row v-for="value1 in props.row.children" v-bind:key="value1.id">
              <el-col :span="4" class="el-4">
                <el-tag closable>{{ value1.authName }}</el-tag
                >>
              </el-col>
              <el-col :span="20">
                <el-row
                  v-for="value2 in value1.children"
                  v-bind:key="value2.id"
                >
                  <el-col :span="4">
                    <el-tag type="success" closable>{{
                      value2.authName
                    }}</el-tag
                    >>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      v-for="value3 in value2.children"
                      v-bind:key="value3.id"
                      type="warning"
                      closable
                      >{{ value3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName"> </el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <!-- {{ scope }} -->
            <!-- 编辑角色信息按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="isEidtRolesInfo(scope.row)"
            ></el-button>
            <!-- 分配用户权限按钮 -->
            <el-button
              type="success"
              icon="el-icon-check"
              @click="isDistributeRolesAuthority(scope.row)"
              circle
            ></el-button>
            <!-- 删除角色信息按钮 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteRoleInfo(scope.row)"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- 为角色分配权限  弹窗 -->
    <el-dialog
      title="分配角色权限"
      :visible.sync="distributeRolesAuthorityVisible"
    >
      <!-- 使用树形结构渲染角色所有权限 -->
      <!-- 如果使用了默认选中属性default-checked-keys  则必须要有node-key属性存在  并且值应该一一对应 -->
      <el-tree
        :data="rolesAuthorityData"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="select"
        :props="defaultProps"
        ref="treeNode"
      >
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="distributeRolesAuthorityVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="editRolesAuthority">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色信息  弹窗 -->
    <el-dialog title="编辑角色" :visible.sync="EidtRolesInfoVisible">
      <el-form v-bind:model="addRoleData" v-bind:rules="userRules">
        <el-form-item label="角色名称" prop="rolename">
          <el-input
            autocomplete="off"
            v-model="addRoleData.rolename"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleinfo">
          <el-input
            autocomplete="off"
            v-model="addRoleData.roleinfo"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EidtRolesInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="EidtRolesInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色信息  弹窗 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible">
      <el-form v-bind:model="addRoleData" v-bind:rules="userRules">
        <el-form-item label="角色名称" prop="rolename">
          <el-input
            autocomplete="off"
            v-model="addRoleData.rolename"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleinfo">
          <el-input
            autocomplete="off"
            v-model="addRoleData.roleinfo"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表数据
      tableData: [],
      // 控制  编辑角色信息  弹窗是否显示
      EidtRolesInfoVisible: false,
      // 控制  分配角色权限  弹窗是否显示
      distributeRolesAuthorityVisible: false,
      // 控制  添加角色  弹窗是否显示
      addRoleVisible: false,
      // 角色权限数据
      rolesAuthorityData: [],
      // 子节点默认展开规则  按照是否存在children进行展开  展开之后的文本根据label对应
      defaultProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中角色权限--数据
      select: [],
      rolesId: "",

      addRoleData: {
        rolename: "",
        roleinfo: "",
      },

      // 角色信息修改验证规则
      userRules: {
        rolename: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" },
        ],
        roleinfo: [
          { required: true, message: "角色描述不能为空·", trigger: "blur" },
          {
            min: 5,
            max: 100,
            message: "长度在 5 到 100 个字符",
            trigger: "blur",
          },
        ],
      },

      // 存储角色id
      rid: "",
    };
  },

  methods: {
    // 加载  角色列表的数据
    loadRolesTableData() {
      this.$axios({
        url: "roles",
        method: "get",
      }).then((backData) => {
        // console.log(backData);
        this.tableData = backData.data.data;
      });
    },

    // 显示 添加角色弹窗
    isAddRole() {
      this.addRoleVisible = true;
    },

    // 添加角色
    addRole() {
      var roleName = this.addRoleData.rolename;
      var roleDesc = this.addRoleData.roleinfo;
      this.$axios({
        url: `roles`,
        method: "post",
        data: {
          roleName,
          roleDesc,
        },
      }).then((backData) => {
        if (backData.data.meta.status == 201) {
          this.$message({
            message: backData.data.meta.msg,
            type: "success",
          });
        } else {
          this.$message.error(backData.data.meta.msg);
        }
        this.addRoleVisible = false;
        this.loadRolesTableData();
      });
    },

    // 显示  编辑角色信息的 弹窗
    isEidtRolesInfo(row) {
      this.EidtRolesInfoVisible = true;
      // console.log(row);
      this.rid = row.rid;
    },

    // 提交  编辑好的角色信息  发送给服务器  服务器进行修改
    EidtRolesInfo() {
      var rid = this.rid;
      var roleName = this.addRoleData.rolename;
      var roleDesc = this.addRoleData.roleinfo;
      this.$axios({
        url: `roles/${rid}`,
        method: "put",
        data: {
          roleName,
          roleDesc,
        },
      }).then((backData) => {
        if (backData.data.meta.status == 200) {
          this.$message({
            message: backData.data.meta.msg,
            type: "success",
          });
        } else {
          this.$message.error(backData.data.meta.msg);
        }
        this.EidtRolesInfoVisible = false;
        this.loadRolesTableData();
      });
    },

    // 显示  分配角色权限的  弹出框
    isDistributeRolesAuthority(rolesInfo) {
      // 将角色id保存在vue对象中   为后续提交修改角色权限表单做参数
      this.rolesId = rolesInfo.rid;
      // console.log(rolesInfo);
      // console.log(this.rolesId);
      var tmpArry = [];
      rolesInfo.children.forEach((e1) => {
        e1.children.forEach((e2) => {
          e2.children.forEach((e3) => {
            // console.log(e3.authName);
            tmpArry.push(e3.id);
          });
        });
      });
      // console.log(tmpArry);
      this.select = tmpArry;
      // console.log(this.select);
      // 在弹窗渲染之前获取所有的权限列表
      this.$axios({
        url: "rights/tree",
        method: "get",
      }).then((backData) => {
        // console.log(backData);
        this.rolesAuthorityData = backData.data.data;
      });
      this.distributeRolesAuthorityVisible = true;
    },

    // 提交  分配好的角色权限    发送给服务器  服务器进行修改
    editRolesAuthority() {
      // console.log(this.$refs.treeNode.getCheckedKeys());
      // console.log(this.$refs.treeNode.getHalfCheckedKeys());
      // console.log(this.rolesId);
      var a1 = this.$refs.treeNode.getCheckedKeys();
      var a2 = this.$refs.treeNode.getHalfCheckedKeys();
      // 合并连个数组
      var newArry = a1.concat(a2);
      // console.log(newArry);
      // 将数组转化为字符串  每个数组元素之间默认用逗号进行隔开
      var arrStr = newArry.join();
      // 发送axios请求
      this.$axios({
        url: `roles/${this.rolesId}/rights`,
        method: "post",
        data: {
          rids: arrStr,
        },
      }).then((backData) => {
        if (backData.data.meta.status == 200) {
          this.$message({
            message: backData.data.meta.msg,
            type: "success",
          });
        } else {
          this.$message.error(backData.data.meta.msg);
        }
        this.distributeRolesAuthorityVisible = false;
        this.loadRolesTableData();
        // 跳转到主界面
        this.$router.push('/');
        // 刷新主界面
        location.reload();
      });
    },

    // 删除角色信息
    deleteRoleInfo(row){
      // console.log(row.rid)
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios({
            url: `roles/${row.rid}`,
            method: "delete",
            // headers: { Authorization: localStorage.getItem("token") },
          }).then((backData) => {
            // console.log(backData);
            if (backData.data.meta.status == 200) {
              this.$message({
                message: backData.data.meta.msg,
                type: "success",
              });
              this.loadRolesTableData();
            } else {
              this.$message.error(backData.data.meta.msg);
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  // 在页面渲染之前加载数据
  beforeMount() {
    this.loadRolesTableData();
  },
};
</script>

<style>
.mybtn {
  margin-left: -500px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-table__header-wrapper {
  line-height: 40px;
}
.el-table--fit {
  margin-top: 10px;
}
.el-table th.el-table__cell {
  text-align: center;
  border: 1px solid #ebeef5;
}
.el-table td.el-table__cell {
  border: 1px solid #ebeef5;
  text-align: center;
}
.el-col-20 {
  text-align: left;
}
.el-col-4 {
  text-align: center;
}
.el-row {
  line-height: 50px;
}
.el-tag.el-tag--warning {
  margin-right: 10px;
}
.el-4 {
  margin-right: -90px;
}
</style>