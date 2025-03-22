import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';

Vue.use(ElementUI);
Vue.prototype.$axios = axios; // 将 axios 添加到 Vue 原型

// 设置 Axios 基础 URL
axios.defaults.baseURL = 'http://localhost:8080'; // 替换为你的后端 API 地址
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');