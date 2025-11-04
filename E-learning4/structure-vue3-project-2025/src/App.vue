<template>
  <div id="app">
    <nav>
      <router-link to="/">Trang chủ</router-link> |
      <router-link to="/login">Đăng nhập</router-link> |
      <router-link to="/register">Đăng ký</router-link>  |
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Căn giữa nội dung */
#app {
  text-align: center;
  font-family: 'Arial', sans-serif;
  margin: 0 auto;
  padding: 20px;
  max-width: 600px;
}

/* Thanh menu */
nav {
  margin-bottom: 30px;
}

nav a {
  text-decoration: none;
  color: #007bff;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  font-weight: bold;
  color: #0056b3;
}

/* Vùng nội dung */
main {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  background-color: #fafafa;
}
</style>
