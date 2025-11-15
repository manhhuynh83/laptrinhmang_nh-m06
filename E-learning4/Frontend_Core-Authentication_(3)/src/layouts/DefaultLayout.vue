<template>
  <div>
    <header class="p-4 bg-white shadow">
      <nav class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="font-bold">QuickPlay</router-link>
        <div class="space-x-4">
          <router-link to="/">Home</router-link>
          <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
          <router-link v-if="isAuthenticated" to="/profile">Profile</router-link>
        </div>
      </nav>
    </header>

    <main class="container mx-auto p-6">
      <slot />
    </main>

    <footer class="p-4 bg-gray-100 text-center">© QuickPlay</footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../store/auth';
const auth = useAuthStore();
const isAuthenticated = computed(() => auth.isAuthenticated);
</script>

<style scoped>
</style>
