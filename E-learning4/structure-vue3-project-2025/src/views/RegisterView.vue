<template>
  <div class="register-container">
    <h2>Đăng ký tài khoản</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Email:</label>
        <input v-model="email" type="email" placeholder="Nhập email..." required />
      </div>

      <div class="form-group">
        <label>Mật khẩu:</label>
        <input v-model="password" type="password" placeholder="Nhập mật khẩu..." required />
      </div>

      <div class="form-group">
        <label>Xác nhận mật khẩu:</label>
        <input v-model="confirmPassword" type="password" placeholder="Nhập lại mật khẩu..." required />
      </div>

      <button type="submit">Đăng ký</button>
    </form>

    <p class="login-link">
      Đã có tài khoản?
      <router-link to="/login">Đăng nhập</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

function register() {
  if (password.value !== confirmPassword.value) {
    alert('Mật khẩu không khớp!')
    return
  }

  // Lấy danh sách users hiện có (nếu chưa có thì mảng rỗng)
  const users = JSON.parse(localStorage.getItem('users') || '[]')

  // Kiểm tra email đã tồn tại chưa
  if (users.some(u => u.email === email.value)) {
    alert('Email này đã được đăng ký!')
    return
  }

  // Thêm user mới
  users.push({
    email: email.value,
    password: password.value
  })

  localStorage.setItem('users', JSON.stringify(users))
  alert('Đăng ký thành công!')

  // Chuyển hướng sang trang đăng nhập
  router.push('/login')
}
</script>


<style scoped>
.register-container {
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

.login-link {
  text-align: center;
  margin-top: 15px;
}

.login-link a {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
