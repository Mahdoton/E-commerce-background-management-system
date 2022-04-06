<template>
  <div>
    <!-- 面包屑栏 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="background: white; line-height: 40px; padding-left: 20px"
    >
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 数据饼图 -->
    <div class="bing">
      <!-- 用户来源饼图 -->
      <div
        id="userSource"
        style="width: 700px; height: 400px; background: white"
      ></div>

      <!-- 订单来源饼图 -->
      <div
        id="paySource"
        style="width: 700px; height: 400px; background: white"
      ></div>

      <!-- 用户群体饼图 -->
      <div
        id="userTeam"
        style="width: 700px; height: 400px; background: white"
      ></div>

      <!-- 订单详情饼图 -->
      <div
        id="payStatus"
        style="width: 700px; height: 400px; background: white"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  /* beforeMount() {
    this.$axios({
      url: "reports/type/1",
      method: "get",
    }).then((backData) => {
      // console.log(backData);
    });
  }, */
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var userSource = echarts.init(
      document.getElementById("userSource"),
      "wonderland"
    );
    userSource.setOption({
      title: {
        text: "用户来源",
      },
      tooltip: {},
      series: [
        {
          name: "访问来源",
          type: "pie", // 设置图表类型为饼图
          radius: "55%", // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
          data: [
            // 数据数组，name 为数据项名称，value 为数据项值
            { value: 235, name: "视频广告" },
            { value: 274, name: "联盟广告" },
            { value: 310, name: "邮件营销" },
            { value: 335, name: "直接访问" },
            { value: 400, name: "搜索引擎" },
          ],
        },
      ],
    });

    var paySource = echarts.init(
      document.getElementById("paySource"),
      "wonderland"
    );
    paySource.setOption({
      title: {
        text: "订单来源",
      },
      tooltip: {},
      series: [
        {
          name: "订单来源",
          type: "pie", // 设置图表类型为饼图
          radius: "55%", // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
          roseType: "angle",
          data: [
            // 数据数组，name 为数据项名称，value 为数据项值
            { value: 400, name: "华东" },
            { value: 199, name: "华北" },
            { value: 100, name: "华西" },
            { value: 335, name: "华中" },
            { value: 700, name: "华南" },
          ],
        },
      ],
    });

    var userTeam = echarts.init(
      document.getElementById("userTeam"),
      "wonderland"
    );
    userTeam.setOption({
      title: {
        text: "用户群体",
      },
      tooltip: {},
      series: [
        {
          name: "用户群体",
          type: "pie", // 设置图表类型为饼图
          radius: "55%", // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
          roseType: "angle",
          data: [
            // 数据数组，name 为数据项名称，value 为数据项值
            { value: 235, name: "<15岁" },
            { value: 350, name: "15岁~18岁" },
            { value: 500, name: "18岁~30岁" },
            { value: 200, name: "30岁~50岁" },
            { value: 100, name: ">50岁" },
          ],
        },
      ],
    });

    var payStatus = echarts.init(
      document.getElementById("payStatus"),
      "wonderland"
    );
    payStatus.setOption({
      title: {
        text: "订单状态",
      },
      tooltip: {},
      series: [
        {
          name: "订单状态",
          type: "pie", // 设置图表类型为饼图
          radius: "55%", // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
          data: [
            // 数据数组，name 为数据项名称，value 为数据项值
            { value: 324, name: "已付款" },
            { value: 134, name: "未付款" },
          ],
        },
      ],
    });
  },
};
</script>

<style>
.bing {
  background: white;
  display: flex;
  flex-wrap: wrap;
}
.el-breadcrumb {
    margin-bottom: 10px;
}
</style>