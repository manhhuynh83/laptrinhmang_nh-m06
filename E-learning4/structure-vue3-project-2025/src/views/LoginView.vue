<template>
    <div class="Login">
        <h1>Đăng nhập</h1>
        <from @submit.prevent="login">
            <input type = "text" placeholder = "Tài khoản" v-model="username"/>
            <input type = "password" placeholder = "Mật khẩu" v-model="password"/>
            <button type="submit">Đăng nhập</button>
        </from>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');

function login() {
    console.log(`Đăng nhập với tài khoản: ${username.value} và mật khẩu: ${password.value}`);
}
</script>

<style scoped>
.Login {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
}

input {
    margin: 5px;
    padding: 8px;
}
</style>