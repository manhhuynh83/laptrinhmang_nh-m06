<template>
  <div class="layout">
    <header class="header">
      <h1 class="logo">E-Learning</h1>
      <nav>
        <router-link to="/">Trang chủ</router-link>
        <router-link v-if="!loggedInUser" to="/login">Đăng nhập</router-link>
        <router-link v-if="!loggedInUser" to="/register">Đăng ký</router-link>

        <span v-if="loggedInUser" class="welcome">
          Xin chào, {{ loggedInUser }}!
          <button @click="logout">Đăng xuất</button>
        </span>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>&copy; 2025 E-Learning Platform. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loggedInUser = ref(null)

onMounted(() => {
  loggedInUser.value = localStorage.getItem('loggedInUser')
})

function logout() {
  localStorage.removeItem('loggedInUser')
  loggedInUser.value = null
  alert('Bạn đã đăng xuất.')
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fafafa;
  font-family: Arial, sans-serif;
}
.header {
  background-color: #42b983;
  color: white;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-size: 22px;
  font-weight: bold;
}
nav a {
  color: white;
  margin-left: 15px;
  text-decoration: none;
  font-weight: 500;
}
nav a.router-link-exact-active {
  text-decoration: underline;
}
.welcome {
  margin-left: 15px;
  font-weight: 500;
}
.welcome button {
  margin-left: 10px;
  background: #fff;
  color: #42b983;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.welcome button:hover {
  background-color: #2c3e50;
  color: white;
}
.main-content {
  flex: 1;
  padding: 40px 20px;
}
.footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 14px;
}
</style>
