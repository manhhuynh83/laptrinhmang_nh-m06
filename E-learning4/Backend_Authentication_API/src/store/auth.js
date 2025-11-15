// src/store/auth.js
import { defineStore } from 'pinia';
import authAPI from '../api/auth';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authAPI.getStoredUser(),
    isAuthenticated: authAPI.isAuthenticated(),
    loading: false,
    error: null,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    fullName: (state) => state.user?.full_name || '',
    email: (state) => state.user?.email || '',
    username: (state) => state.user?.username || '',
  },

  actions: {
    /**
     * Register new user
     */
    async register(userData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authAPI.register(userData);
        
        if (response.success) {
          this.user = response.data.user;
          this.isAuthenticated = true;
        }
        
        return response;
      } catch (error) {
        this.error = error.message || 'Registration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Login user
     */
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authAPI.login(credentials);
        
        if (response.success) {
          this.user = response.data.user;
          this.isAuthenticated = true;
        }
        
        return response;
      } catch (error) {
        this.error = error.message || 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Logout user
     */
    async logout() {
      this.loading = true;
      this.error = null;

      try {
        await authAPI.logout();
        
        this.user = null;
        this.isAuthenticated = false;
        
        // Redirect to login
        const router = useRouter();
        router.push('/login');
      } catch (error) {
        this.error = error.message || 'Logout failed';
        
        // Vẫn clear state dù API lỗi
        this.user = null;
        this.isAuthenticated = false;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Get current user info from API
     */
    async fetchCurrentUser() {
      this.loading = true;
      this.error = null;

      try {
        const response = await authAPI.getCurrentUser();
        
        if (response.success) {
          this.user = response.data;
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        
        return response;
      } catch (error) {
        this.error = error.message || 'Failed to fetch user';
        
        // Nếu token không hợp lệ, clear state
        if (error.status === 401) {
          this.user = null;
          this.isAuthenticated = false;
        }
        
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Initialize auth state from localStorage
     */
    initializeAuth() {
      const user = authAPI.getStoredUser();
      const hasToken = authAPI.isAuthenticated();
      
      if (user && hasToken) {
        this.user = user;
        this.isAuthenticated = true;
      } else {
        this.user = null;
        this.isAuthenticated = false;
      }
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null;
    }
  }
});