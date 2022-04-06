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
      <el-breadcrumb-item :to="{ path: '/GoodList' }"
        >商品列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 文字提示 -->
    <el-alert
      title="添加商品信息"
      type="info"
      center
      show-icon
      style="height: 40px"
    >
    </el-alert>

    <!-- 添加商品信息标签页 -->

    <el-tabs
      :tab-position="tabPosition"
      style="height: 900px; margin-top: 50px"
    >
      <el-tab-pane label="基本信息">
        <div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="ruleForm.price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="weight">
              <el-input v-model="ruleForm.weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="number">
              <el-input v-model="ruleForm.number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="number">
              <div class="block">
                <el-cascader
                  v-model="checkvalue"
                  :options="options"
                  :props="{
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                  }"
                  @change="handleChange"
                ></el-cascader>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图片上传">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="header"
          :limit="1"
          :on-success="handleSuccess"
          :file-list="file"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取图片</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品介绍">
        <el-button
          type="success"
          plain
          style="margin-bottom: 15px"
          @click="submitGoodsInfo"
          >提交商品信息</el-button
        >
        <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          v-model="textarea"
        >
        </el-input>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabPosition: "left",
      ruleForm: {
        name: "",
        price: "",
        weight: "",
        number: "",
      },
      // 文本域中的值
      textarea: "",

      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },

      // 商品分类列表数据
      checkvalue: [],
      // 联级选择器的选项配置  可以通过props对象进行配置
      options: [],

      // 文件上传文件列表
      file: [],

      // 设置请求头
      header: {
        Authorization: localStorage.getItem("token"),
      },

      // 存储文件上传返回的参数
      image:{}
    };
  },

  methods: {
    // 联级选择器选中的值发生变化时触发
    handleChange() {
      // 选中的商品分类列表数据
      console.log(this.checkvalue);
    },
    // 提交  添加的商品信息
    submitGoodsInfo() {
      // console.log(this.ruleForm);
      // console.log(this.checkvalue);
      // console.log(this.textarea);
      var goods_name = this.ruleForm.name;
      var goods_price = this.ruleForm.price;
      var goods_weight = this.ruleForm.weight;
      var goods_number = this.ruleForm.number;
      var goods_introduce = this.textarea;
      var pic = this.image;
      var goods_cat = `${this.checkvalue.join(",")}`;
      console.log(goods_cat);
      this.$axios({
        url: "goods",
        method: "post",
        data: {
          goods_name,
          goods_cat,
          goods_price,
          goods_weight,
          goods_number,
          goods_introduce,
          pics:[{
            pic
          }]
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
        this.$router.push("goods");
      });
    },
    // 图片上传成功时的回调函数
    handleSuccess(response, file, fileList) {
      // console.log(response);
      this.image = response.data.tmp_path;
    },
    // 通过点击按钮执行http提交图片
    submitUpload() {
      this.$refs.upload.submit();
    },
  },

  beforeMount() {
    this.$axios({
      url: "categories?type=[1,2,3]",
      method: "get",
    }).then((backData) => {
      // console.log(backData);
      this.options = backData.data.data;
    });
  },
};
</script>

<style>
.block {
  text-align: left;
}
.el-tabs__content {
  text-align: left;
  line-height: 20px;
}
</style>