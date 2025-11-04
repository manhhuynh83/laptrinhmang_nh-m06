<template>
  <div class="auth-layout">
    <div class="auth-box">
      <router-view />
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.auth-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #74ebd5, #ACB6E5);
}

.auth-box {
  background: white;
  padding: 40px 50px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
}
</style>
