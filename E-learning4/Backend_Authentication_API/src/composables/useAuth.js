// src/composables/useAuth.js
import { computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

/**
 * Composable for authentication operations
 */
export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  // Computed properties
  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isAdmin = computed(() => authStore.isAdmin);
  const loading = computed(() => authStore.loading);
  const error = computed(() => authStore.error);

  /**
   * Login
   */
  const login = async (credentials) => {
    try {
      const response = await authStore.login(credentials);
      
      if (response.success) {
        // Redirect to home or dashboard
        router.push('/');
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Register
   */
  const register = async (userData) => {
    try {
      const response = await authStore.register(userData);
      
      if (response.success) {
        // Redirect to home or dashboard
        router.push('/');
      }
      
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await authStore.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn redirect dù có lỗi
      router.push('/login');
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      await authStore.fetchCurrentUser();
    } catch (error) {
      console.error('Refresh user error:', error);
      throw error;
    }
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    return user.value?.role === role;
  };

  /**
   * Clear error
   */
  const clearError = () => {
    authStore.clearError();
  };

  return {
    // State
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    
    // Actions
    login,
    register,
    logout,
    refreshUser,
    hasRole,
    clearError
  };
}