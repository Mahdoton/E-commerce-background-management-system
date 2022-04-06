<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  // 监听刷新时间  设置session  数据缓存
  mounted(){
    window.addEventListener('unload',this.saveState());
  },
  methods:{
    saveState(){
      sessionStorage.setItem('state',JSON.stringify(this.$store.state.user));
    }
  }
};
</script>

<style>
#app {
  height: 100%;
}
</style>
