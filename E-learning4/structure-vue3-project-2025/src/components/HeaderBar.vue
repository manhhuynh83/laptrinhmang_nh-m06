<template>
  <header class="header">
    <h1>E-Learning</h1>
    <nav>
      <router-link to="/">Trang chủ</router-link>
      <router-link v-if="!isLoggedIn" to="/login">Đăng nhập</router-link>
      <router-link v-if="!isLoggedIn" to="/register">Đăng ký</router-link>

      <div v-if="isLoggedIn" class="user-info">
        <span>Xin chào, {{ userEmail }}</span>
        <button @click="logout">Đăng xuất</button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
const userEmail = ref('')

onMounted(() => {
  const user = localStorage.getItem('loggedInUser')
  if (user) {
    isLoggedIn.value = true
    userEmail.value = user
  }
})

function logout() {
  localStorage.removeItem('loggedInUser')
  isLoggedIn.value = false
  userEmail.value = ''
  alert('Bạn đã đăng xuất!')
  router.push('/login')
}
</script>

<style scoped>
.header {
  background-color: #42b983;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-radius: 8px;
}

nav {
  display: flex;
  gap: 10px;
  align-items: center;
}

a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

button {
  background: #fff;
  color: #42b983;
  border: none;
  padding: 5px 10px;
  border-r
