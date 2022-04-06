// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';
import './assets/css/style.css';
// 引入封装好的axios插件
import Axios from './assets/js/axios';
import store from './store';
// 将es6语法编译成es5语法  兼容IE和edge浏览器
// import 'babel-polyfill';

// 对axios进行一次封装
// 在所有vue实例对象的原型对象上添加一个$axios属性  属性的值就是axios一整个对象 
// 在所有组件中均可以调用$axios发送http请求
// Vue.prototype.$axios = Axios;

// 使用axios和elementui插件 
Vue.use(ElementUI);
Vue.use(Axios);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
