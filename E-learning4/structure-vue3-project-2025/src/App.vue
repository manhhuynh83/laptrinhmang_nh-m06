<template>
  <div id="app">
    <header>
      <h1>🌐 E-Learning System</h1>
      <nav>
        <router-link to="/">Trang chủ</router-link> |
        <router-link to="/login">Đăng nhập</router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <p>© 2025 E-Learning Project - Lập trình mạng</p>
    </footer>
  </div>
</template>

<script setup></script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #fafafa;
}

header {
  background-color: #2c3e50;
  color: white;
  padding: 10px 20px;
}

nav a {
  color: white;
  margin: 0 10px;
  text-decoration: none;
}

nav a.router-link-active {
  font-weight: bold;
  border-bottom: 2px solid #42b983;
}

main {
  padding: 20px;
}

footer {
  background-color: #f5f5f5;
  text-align: center;
  padding: 10px;
  font-size: 14px;
  color: #555;
}
</style>
