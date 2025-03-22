import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login.vue';
import AdminView from '../views/AdminView.vue'; // 管理员视图
import SuperAdminView from '../views/SuperAdminView.vue'; // 超级管理员视图

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/adminview',
      name: 'AdminView',
      component: AdminView // 管理员视图
    },
    {
      path: '/superadminview',
      name: 'SuperAdminView',
      component: SuperAdminView // 超级管理员视图
    }
  ]
});