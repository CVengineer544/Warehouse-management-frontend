<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px" class="aside">
      <div class="logo-container">
        <img src="@/assets/logo.jpg" alt="Logo" class="logo" />
      </div>
      <div class="menu-top-space"></div>
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @select="handleSelect"
        background-color="#f5f5f5"
        text-color="#333"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template #title>用户管理</template>
          <el-menu-item index="1-1">启用用户</el-menu-item>
          <el-menu-item index="1-2">禁用用户</el-menu-item>
          <el-menu-item index="1-3">重置密码</el-menu-item>
          <el-menu-item index="1-4">删除用户</el-menu-item>
          <el-menu-item index="1-5">添加用户</el-menu-item>
          <el-menu-item index="1-6">更改权限</el-menu-item> <!-- 新增菜单项 -->
        </el-submenu>
        <el-menu-item index="2">其他功能</el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">夏理小仓库管理系统 - 欢迎，超级管理员！</el-header>
      <el-main class="main">
        <el-breadcrumb>
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        </el-breadcrumb>

        <h1>超级管理员视图</h1>
        <p>欢迎，超级管理员！</p>

        <!-- 启用用户 -->
        <div v-if="selectedMenu === '1-1'">
          <h2>启用用户</h2>
          <el-table :data="enabledUsers" style="width: 100%">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button @click="enableUser(scope.row.id)">启用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 禁用用户 -->
        <div v-if="selectedMenu === '1-2'">
          <h2>禁用用户</h2>
          <el-table :data="disabledUsers" style="width: 100%">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button @click="disableUser(scope.row.id)">禁用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 重置密码 -->
        <div v-if="selectedMenu === '1-3'">
          <h2>重置密码</h2>
          <el-table :data="allUsers" style="width: 100%">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-input v-model="newPassword[scope.row.id]" placeholder="新密码" style="width: 200px;"></el-input>
                <el-button @click="changePassword(scope.row.id)">更改密码</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 删除用户 -->
        <div v-if="selectedMenu === '1-4'">
          <h2>删除用户</h2>
          <el-table :data="allUsers" style="width: 100%">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button @click="deleteUser(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 添加用户 -->
        <div v-if="selectedMenu === '1-5'">
          <h2>添加用户</h2>
          <el-form :model="newUser" ref="userForm" label-width="120px">
            <el-form-item label="ID">
              <el-input v-model="newUser.id" placeholder="请输入用户ID（可选）"></el-input>
            </el-form-item>
            <el-form-item label="账号">
              <el-input v-model="newUser.account" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="newUser.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password" v-model="newUser.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="newUser.sex" placeholder="请选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="newUser.type" placeholder="请选择用户类型">
                <el-option label="管理员" value="1"></el-option>
                <el-option label="信息管理员" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addUser">添加用户</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 更改权限 -->
        <div v-if="selectedMenu === '1-6'">
          <h2>更改权限</h2>
          <el-table :data="allUsers" style="width: 100%">
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column label="当前权限" prop="type"></el-table-column>
            <el-table-column label="新权限">
              <template #default="scope">
                <el-select v-model="newUserType[scope.row.id]" placeholder="选择新权限">
                  <el-option label="管理员" :value="1"></el-option>
                  <el-option label="信息管理员" :value="2"></el-option>
                </el-select>
                <el-button @click="changeUserType(scope.row.id)">更改权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
      <el-footer class="footer">xmut-2024-web+spingboot+javaEE+JWT+MYsql</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import api from '@/utils/api'; // 确保正确导入 api.js

export default {
  name: 'SuperAdminView',
  data() {
    return {
      selectedMenu: '1-1',
      enabledUsers: [],
      disabledUsers: [],
      allUsers: [],
      newPassword: {},
      newUser: { // 新增用户数据模型
        id: null, // 新增 ID 字段
        account: '',
        username: '',
        password: '',
        sex: '',
        type: ''
      },
      newUserType: {} // 新增用户权限数据模型
    };
  },
  methods: {
    handleSelect(index) {
      this.selectedMenu = index;
      if (index === '1-1') {
        this.fetchEnabledUsers();
      } else if (index === '1-2') {
        this.fetchDisabledUsers();
      } else if (index === '1-3') {
        this.fetchAllUsers();
      } else if (index === '1-4') {
        this.fetchAllUsers();
      } else if (index === '1-5') { // 选择添加用户时清空输入框
        this.newUser = { id: null, account: '', username: '', password: '', sex: '', type: '' };
      } else if (index === '1-6') { // 选择更改权限时清空权限选择
        this.newUserType = {};
      }
    },
    fetchEnabledUsers() {
      api.user.getEnabledUsers().then(response => {
        this.enabledUsers = response.data;
      }).catch(error => {
        console.error("获取启用用户失败:", error);
      });
    },
    fetchDisabledUsers() {
      api.user.getDisabledUsers().then(response => {
        this.disabledUsers = response.data;
      }).catch(error => {
        console.error("获取禁用用户失败:", error);
      });
    },
    fetchAllUsers() {
      api.user.getAllUsers().then(response => {
        this.allUsers = response.data;
      }).catch(error => {
        console.error("获取所有用户失败:", error);
      });
    },
    enableUser(id) {
      api.user.enableUser(id).then(() => {
        this.fetchEnabledUsers();
        this.fetchDisabledUsers();
      }).catch(error => {
        console.error("启用用户失败:", error);
      });
    },
    disableUser(id) {
      api.user.disableUser(id).then(() => {
        this.fetchEnabledUsers();
        this.fetchDisabledUsers();
      }).catch(error => {
        console.error("禁用用户失败:", error);
      });
    },
    changePassword(id) {
  const newPassword = this.newPassword[id]; // 获取新密码
  // 直接传递新密码值
  api.user.changePassword(id, newPassword).then(() => {
    this.$message.success('密码修改成功');
    this.fetchAllUsers(); // 刷新用户列表
  }).catch(error => {
    console.error("修改密码失败:", error);
    this.$message.error('修改密码失败');
  });
},
    deleteUser(id) {
      api.user.deleteUser(id).then(() => {
        this.fetchAllUsers();
      }).catch(error => {
        console.error("删除用户失败:", error);
      });
    },
    addUser() {
      // 调用 API 添加用户
      api.user.addUser(this.newUser).then(() => {
        this.$message.success('用户添加成功');
        this.fetchAllUsers(); // 刷新用户列表
        this.newUser = { id: null, account: '', username: '', password: '', sex: '', type: '' }; // 清空输入框
      }).catch(error => {
        console.error("添加用户失败:", error);
        this.$message.error('添加用户失败');
      });
    },
    changeUserType(id) {
      const newType = this.newUserType[id];
      api.user.changeUserType(id, newType).then(() => {
        this.$message.success('权限更改成功');
        this.fetchAllUsers(); // 刷新用户列表
      }).catch(error => {
        console.error("更改权限失败:", error);
        this.$message.error('更改权限失败');
      });
    }
  },
  mounted() {
    this.fetchEnabledUsers();
    this.fetchDisabledUsers();
    this.fetchAllUsers();
  }
};
</script>

<style scoped>
.aside {
  background-color: #f5f5f5; /* 左侧菜单背景色 */
}

.logo-container {
  text-align: center; /* Logo 居中 */
  padding: 10px 0; /* Logo 上下内边距 */
}

.logo {
  width: 100%; /* Logo 宽度为 100% */
  max-width: 180px; /* Logo 最大宽度 */
  height: auto; /* 高度自适应 */
}

.menu-top-space {
  height: 20px; /* 设置空白区域的高度 */
}

.header {
  background-color: #409EFF; /* Header 背景色 */
  color: white; /* Header 字体颜色 */
  text-align: center; /* Header 文本居中 */
  line-height: 60px; /* Header 高度 */
}

.main {
  background-color: #ffffff; /* Main 内容区域背景色 */
  padding: 20px; /* Main 内边距 */
}

.footer {
  background-color: #f0f0f0; /* Footer 背景色 */
  text-align: center; /* Footer 文本居中 */
  line-height: 60px; /* Footer 高度 */
}
</style>