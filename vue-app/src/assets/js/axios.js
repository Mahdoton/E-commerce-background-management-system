import Axios from 'axios';

var myPlugin = {
  // 当插件是一个对象时  都必须暴露一个install方法  install 方法调用时，会将 Vue 作为参数传入
  install(Vue) {
    // 对axios进行二次封装
    // 给每次axios发起请求的基准地址进行设置
    // 当请求不是登录请求时  都需要在请求头上面加上Authorization字段  字段的值就是token的值
    var axios_obj = Axios.create({
      baseURL: "http://localhost:8888/api/private/v1/"
    });
    // 发送axios请求之前进行调用  使用axios对象的拦截器进行请求拦截
    axios_obj.interceptors.request.use(function (config) {
      if (config.url != 'login') {
        config.headers.Authorization = localStorage.getItem('token');
      }
      // 返回axios对象
      return config;
    });
    Vue.prototype.$axios = axios_obj;
    // 封装完成后，每次发起http请求都会对axios对象进行修改
    // 因此请求中不需要添加基准地址和请求头信息
  }
};
export default myPlugin;