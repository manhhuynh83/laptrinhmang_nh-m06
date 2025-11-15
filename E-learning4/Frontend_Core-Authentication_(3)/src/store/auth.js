import { defineStore } from 'pinia';
import { authAPI } from '@/api/auth.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },

  actions: {
    async login(credentials) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await authAPI.login(credentials);
        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_info', JSON.stringify(user));
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Đăng nhập thất bại';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async register(userData) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await authAPI.register(userData);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Đăng ký thất bại';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      try {
        await authAPI.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.clearAuth();
      }
    },

    clearAuth() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    },

    async fetchProfile() {
      try {
        const response = await authAPI.getProfile();
        this.user = response.data.user;
        localStorage.setItem('user_info', JSON.stringify(this.user));
        return response.data;
      } catch (error) {
        this.clearAuth();
        throw error;
      }
    },
  },
});