// src/api/user.js
import axiosInstance from './axiosInstance';

/**
 * User API Service
 */
const userAPI = {
  /**
   * Get user profile
   * @param {Number} userId 
   * @returns {Promise}
   */
  getProfile: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Number} userId 
   * @param {Object} userData 
   * @returns {Promise}
   */
  updateProfile: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload avatar
   * @param {File} file 
   * @returns {Promise}
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await axiosInstance.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all users (Admin only)
   * @param {Object} params - { page, limit, search }
   * @returns {Promise}
   */
  getAllUsers: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/users', { params });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default userAPI;