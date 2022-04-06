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
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 订单列表表格展示栏 -->
    <el-table
      ref="singleTable"
      :data="orderListTableData"
      highlight-current-row
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column property="order_number" label="订单编号" width="120">
      </el-table-column>
      <el-table-column
        property="order_price"
        label="订单价格（元）"
        width="120"
      >
      </el-table-column>
      <el-table-column property="" label="是否付款">
        <el-tag type="danger">未付款</el-tag>
      </el-table-column>
      <el-table-column property="is_send" label="是否发货"> </el-table-column>
      <el-table-column property="create_time" label="下单时间">
      </el-table-column>
      <el-table-column label="操作">
        <!-- scope -->
        <template slot-scope="">
          <el-row>
            <!-- 编辑商品信息按钮 -->
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页栏 -->
    <template>
      <div class="block">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :page-sizes="[10, 20]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
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
      // 用于订单列表做循环的数据
      orderListTableData: [],

      // 分页栏暂存数据
      pagenum: 1,
      pagesize: 10,
      total: 100,
    };
  },

  methods: {
    getOrderList() {
      this.$axios({
        url: `orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        method: "get",
      }).then((backData) => {
        // console.log(backData);
        this.orderListTableData = backData.data.data.goods;
        this.total = backData.data.data.total;
      });
    },
    sizeChange(size) {
      // console.log(size);
      this.pagesize = size;
      this.getOrderList();
    },
    currentChange(num) {
      // console.log(num);
      this.pagenum = num;
      this.getOrderList();
    },
  },

  beforeMount() {
    this.getOrderList();
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
</style>