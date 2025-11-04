<template>
    <div class="not-found">\
        <h1>404 - Không tìm thấy trang</h1>
        <p>Rất tiếc, trang bạn đang tìm kiếm không tồn tại.</p>
        <router-link to="/">Quay về trang chủ</router-link>
    </div>
</template>

<script setup></script>

<style scoped>
.not-found {
    text-align: center;
    margin-top: 100px;
}
</style>