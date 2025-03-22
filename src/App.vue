<template>
  <div id="app">
    <div class="background">
      <router-view></router-view> <!-- 这里将渲染当前路由对应的组件 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* 防止出现滚动条 */
}

#app {
  height: 100%; /* 确保应用占满整个高度 */
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('@/assets/bj.jpg'); /* 确保路径正确 */
  background-size: cover; /* 背景图覆盖整个容器 */
  background-position: center; /* 背景图居中 */
  background-repeat: no-repeat; /* 不重复背景图 */
  opacity: 0.8; /* 可以调整背景透明度 */
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 确保登录框在垂直方向上居中 */
}
</style>