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
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
        v-model="searchGoodInfo"
        placeholder="请输入内容"
        class="input-with-select"
        style="width: 400px; margin-left: -100px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchGoods"
        ></el-button>
      </el-input>
      <el-button type="success" plain @click="showAddGoodsPopup"
        >添加商品</el-button
      >
    </div>

    <!-- 商品列表表格展示栏 -->
    <el-table
      ref="singleTable"
      :data="goodsTableData"
      highlight-current-row
      style="width: 100%; margin-top: 15px"
    >
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column property="goods_name" label="商品名称" width="120">
      </el-table-column>
      <el-table-column
        property="goods_price"
        label="商品价格（元）"
        width="120"
      >
      </el-table-column>
      <el-table-column property="goods_weight" label="商品重量">
      </el-table-column>
      <el-table-column property="add_time" label="创建时间"> </el-table-column>
      <el-table-column label="操作">
        <!-- scope -->
        <template slot-scope="scope">
          <el-row>
            <!-- 编辑商品信息按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditGoodsInfo(scope.row)"
            ></el-button>
            <!-- 删除商品信息按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteGoods(scope.row)"
            ></el-button>
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

    <!-- 编辑商品信息的子页面弹窗 -->
    <el-dialog title="编辑商品" :visible.sync="editGoodsFormVisible">
      <el-form v-bind:model="editGoodsData">
        <el-form-item label="商品名称">
          <el-input
            autocomplete="off"
            v-model="editGoodsData.goods_name"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="商品价格（元）">
          <el-input
            autocomplete="off"
            v-model="editGoodsData.goods_price"
          ></el-input>
        </el-form-item> </el-form
      ><el-form>
        <el-form-item label="商品重量">
          <el-input
            autocomplete="off"
            v-model="editGoodsData.goods_weight"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item label="商品数量">
          <el-input
            autocomplete="off"
            v-model="editGoodsData.goods_number"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGoodsFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitGoodsInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchGoodInfo: "",
      goodsTableData: [],
      pagenum: "1",
      pagesize: "10",
      total: 100,
      // 编辑商品信息弹窗的当前栏信息
      editGoodsData: {},
      // 控制编辑商品信息弹窗是否弹出
      editGoodsFormVisible: false,
      // 临时存储当前商品编辑好的值
      goods_id: "",
    };
  },
  methods: {
    // 获取商品数据
    getGoodsList() {
      this.$axios({
        url: `goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        method: "get",
      }).then((backData) => {
        // console.log(backData);
        this.goodsTableData = backData.data.data.goods;
        this.total = backData.data.data.total;
      });
    },

    // 当前页码或每页条数发生变化时  更新vue中存储的页码和条数值  并且重新更新商品列表
    sizeChange(size) {
      this.pagesize = size;
      this.getGoodsList();
    },
    currentChange(num) {
      this.pagenum = num;
      this.getGoodsList();
    },
    // 通过搜索显示对应商品数据
    searchGoods() {
      // console.log(this.searchGoodInfo);
      this.$axios({
        url: `goods?query=${this.searchGoodInfo}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        method: "get",
      }).then((backData) => {
        // console.log(backData);
        this.total = backData.data.data.total;
        this.goodsTableData = backData.data.data.goods;
        this.pagenum = backData.data.data.pagenum;
      });
    },
    // 跳转到添加商品页面
    showAddGoodsPopup() {
      // 编程式导航
      this.$router.push("AddGood");
    },

    // 显示编辑商品信息
    showEditGoodsInfo(row) {
      // console.log(row);
      this.editGoodsFormVisible = true;
      this.editGoodsData = row;
      this.goods_id = row.goods_id;
    },

    // 提交编辑好的商品信息
    submitGoodsInfo() {
      // console.log(this.editGoodsData);
      this.$axios({
        url: `goods/${this.goods_id}`,
        method: "put",
        data: {
          goods_name: this.editGoodsData.goods_name,
          goods_price: this.editGoodsData.goods_price,
          goods_number: this.editGoodsData.goods_number,
          goods_weight: this.editGoodsData.goods_weight,
        },
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
        this.editGoodsFormVisible = false;
        this.getGoodsList();
      });
    },

    // 删除商品信息
    deleteGoods(row) {
      // console.log(row.goods_id)
      this.$confirm("此操作将永久删除该商品信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            url: `goods/${row.goods_id}`,
            method: "delete",
            // headers: { Authorization: localStorage.getItem("token") },
          }).then((backData) => {
            // console.log(backData);
            if (backData.data.meta.status == 200) {
              this.$message({
                message: backData.data.meta.msg,
                type: "success",
              });
              this.getGoodsList();
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
  },

  beforeMount() {
    this.getGoodsList();
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