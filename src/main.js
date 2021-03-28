import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入字体图标
import './assets/fonts/iconfont.css'
//导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'



import axios from 'axios'
//配置请求根路劲
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//挂载拦截器 config为请求对象 拦截器作用于发送请求前做处理挂载授权token
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  //最后必须return config
  return config
})
//挂载到原型 使得每一个组件都能通过this访问到$http从而发起axios请求
Vue.prototype.$http = axios;

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
