<template>
  <el-container>
    <el-header class="header">个人信息管理</el-header>
    <el-main class="main">
      <h2>用户信息</h2>
      <el-form :model="user" ref="userForm" label-width="120px">
        <el-form-item label="用户 ID">
          <el-input v-model="user.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="user.account" :disabled="!isEditing.account" style="width: 200px;"></el-input>
          <el-button v-if="!isEditing.account" @click="editField('account')">编辑</el-button>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="user.username" :disabled="!isEditing.username" style="width: 200px;"></el-input>
          <el-button v-if="!isEditing.username" @click="editField('username')">编辑</el-button>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="user.password" :disabled="!isEditing.password" style="width: 200px;"></el-input>
          <el-button v-if="!isEditing.password" @click="editField('password')">编辑</el-button>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="user.sex" :disabled="!isEditing.sex" style="width: 200px;">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
          <el-button v-if="!isEditing.sex" @click="editField('sex')">编辑</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUser">保存</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import api from '@/utils/api'; // 确保正确导入 api.js

export default {
  name: 'UserProfile',
  data() {
    return {
      user: {
        id: null,
        account: '',
        username: '',
        password: '',
        sex: ''
      },
      isEditing: {
        account: false,
        username: false,
        password: false,
        sex: false
      }
    };
  },
  created() {
    this.fetchUserInfo(); // 获取用户信息
  },
  methods: {
    fetchUserInfo() {
      const userId = localStorage.getItem('userId'); // 从 localStorage 获取用户 ID
      if (userId) {
        api.user.getUserById(userId).then(response => {
          this.user = response.data; // 更新用户信息
          // 将性别数字转换为文字
          this.user.sex = this.user.sex === 1 ? '男' : '女';
        }).catch(error => {
          console.error("获取用户信息失败:", error);
          this.$message.error("获取用户信息失败");
        });
      } else {
        this.$message.error("用户 ID 不存在");
      }
    },
    editField(field) {
      this.isEditing[field] = true; // 设置对应字段为可编辑状态
    },
    updateUser() {
      // 将性别文本转换回数字
      this.user.sex = this.user.sex === '男' ? 1 : 0;
      api.user.updateUser(this.user).then(() => {
        this.$message.success("用户信息更新成功");
        // 保存成功后，重置编辑状态
        for (const key in this.isEditing) {
          this.isEditing[key] = false;
        }
      }).catch(error => {
        console.error("更新用户信息失败:", error);
        this.$message.error("更新用户信息失败");
      });
    }
  }
};
</script>

<style scoped>
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
</style>