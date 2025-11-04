<template>
  <div class="notfound-container">
    <h1>404</h1>
    <h2> Không tìm thấy trang</h2>
    <P>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</P>
    <router-link to="/" class="btn">Quay về trang chủ</router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.notfound-container {
  text-align: center;
  margin-top: 120px;
  padding: 40px;
  background-color: #fdfdfd;
  border-radius: 12px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);

}

h1 {
  font-size: 80px;
  color: crimson;
  margin-bottom: 10px;
}

h2{
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 10px;
}

p{
  color: #555;
  font-size: 16px;
  margin-bottom: 30px;
}

.btn{
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
</style>
