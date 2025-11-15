// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import './styles/main.css';

// Import auth store để initialize
import { useAuthStore } from './store/auth';

const app = createApp(App);

// Use plugins
app.use(router);
app.use(pinia);

// Initialize auth state from localStorage
const authStore = useAuthStore();
authStore.initializeAuth();

// Mount app
app.mount('#app');