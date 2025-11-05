<template>
  <div class="login-container">
    <h2>Đăng nhập</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Email:</label>
        <input v-model="email" type="email" placeholder="Nhập email..." required />
      </div>

      <div class="form-group">
        <label>Mật khẩu:</label>
        <input v-model="password" type="password" placeholder="Nhập mật khẩu..." required />
      </div>

      <button type="submit">Đăng nhập</button>
    </form>

    <p class="register-link">
      Chưa có tài khoản?
      <router-link to="/register">Đăng ký ngay</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

function login() {
  
  if (!email.value || !password.value) {
    alert('Vui lòng nhập đầy đủ thông tin!')
    return
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const found = users.find(u => u.email === email.value && u.password === password.value)

  if (found) {
    alert(`Đăng nhập thành công! Xin chào ${email.value}`)
    localStorage.setItem('loggedInUser', email.value)
    router.push('/') // chuyển hướng về trang chủ
  } else {
    alert('Sai email hoặc mật khẩu!')
  }
}

</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 25px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #fafafa;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

button {
  width: 100%;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2c3e50;
}

.register-link {
  text-align: center;
  margin-top: 15px;
}

.register-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
