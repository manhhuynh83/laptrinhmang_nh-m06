// src/api/auth.js
import axiosInstance from './axiosInstance';

/**
 * Auth API Service
 */
const authAPI = {
  /**
   * Register new user
   * @param {Object} userData - { username, email, password, full_name }
   * @returns {Promise}
   */
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise}
   */
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      // Lưu tokens và user info vào localStorage
      if (response.success && response.data) {
        localStorage.setItem('accessToken', response.data.tokens.accessToken);
        localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise}
   */
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axiosInstance.post('/auth/logout', { refreshToken });
      
      // Xóa tokens và user info
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      return response;
    } catch (error) {
      // Vẫn xóa local data dù API lỗi
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  /**
   * Get current user info
   * @returns {Promise}
   */
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Refresh access token
   * @returns {Promise}
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await axiosInstance.post('/auth/refresh', { refreshToken });
      
      if (response.success && response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Get stored user info
   * @returns {Object|null}
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authAPI;