<template>
  <div>
    <!-- 面包屑栏 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="
        background: white;
        line-height: 40px;
        padding-left: 20px;
        margin-bottom: 10px;
      "
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 权限列表 -->
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column property="authName" label="权限名称" width="120">
      </el-table-column>
      <el-table-column property="path" label="路径" width="120">
      </el-table-column>
      <el-table-column property="level" label="层级"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },

  methods: {
    getAllAuthName() {
      this.$axios({
        url: "rights/list",
        method: "get",
      }).then((backData) => {
        // console.log(backData)
        this.tableData = backData.data.data;
      });
    },
  },

  beforeMount() {
    this.getAllAuthName();
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
</style>