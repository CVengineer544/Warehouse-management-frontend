<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">夏理小仓库管理系统</h2>
      <el-form :model="form" :rules="rules" ref="loginForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
          <img 
            :src="captchaImage" 
            @click="refreshCaptcha" 
            style="cursor: pointer; margin-left: 10px; height: 50px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import api from '@/utils/api'

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        captcha: ''
      },
      captchaImage: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    async fetchCaptcha() {
      try {
        const response = await api.captcha.get()
        const base64 = btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        this.captchaImage = `data:image/jpeg;base64,${base64}`;
      } catch (error) {
        console.error('获取验证码失败:', error);
        this.$message.error('获取验证码失败');
      }
    },
    refreshCaptcha() {
      this.fetchCaptcha();
    },
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            // 先验证验证码
            const verifyResponse = await api.captcha.verify(this.form.captcha)

            // 验证码校验
            if (!verifyResponse.data) {
              this.$message.error('验证码错误');
              this.refreshCaptcha(); // 刷新验证码
              return;
            }

            // 登录逻辑
            const loginResponse = await api.login({
              username: this.form.username,
              password: this.form.password
            });

            // 处理登录成功逻辑
            const { token, userId, type } = loginResponse.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('userType', type);

            // 根据用户类型跳转
            switch(type) {
              case 2:
                this.$router.push('/adminview');
                break;
              case 1:
                this.$router.push('/superadminview');
                break;
              default:
                this.$message.error('未知用户类型');
            }
          } catch (error) {
            console.error('用户名或密码错误或您已被封禁：', error);
            this.$message.error(error.response?.data?.message || '用户名或密码错误或您已被封禁');
            this.refreshCaptcha(); // 刷新验证码
          }
        }
      });
    }
  },
  mounted() {
    this.fetchCaptcha(); // 组件挂载时获取验证码
  }
};
</script>