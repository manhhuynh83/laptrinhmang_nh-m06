<template>
  <div class="home-container">
    <h2>  Trang chủ E-Learning</h2>
    <p>Chào mừng bạn đến với hệ thống học trực tuyến của chúng tôi!</p>

    <div class="home-actions">
      <router-link to="/login" class="btn">Đăng nhập</router-link>
      <router-link to="/register" class="btn btn-outline">Đăng ký</router-link>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 100px;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 12px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

h2 {
  color: #42b983;
  font-size: 28px;
  margin-bottom: 15px;
}

p {
  color: #2c3e50;
  font-size: 16px;
  margin-bottom: 30px;
}

.home-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn {
  display: inline-block;
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
}

.btn:hover {
  background-color: #2c3e50;
}

.btn-outline {
  background-color: transparent;
  border: 2px solid #42b983;
  color: #42b983;
}

.btn-outline:hover {
  background-color: #42b983;
  color: white;
}
</style>
