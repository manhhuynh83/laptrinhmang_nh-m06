// src/api/axiosInstance.js
import axios from 'axios';

// Base URL từ biến môi trường
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Thêm token vào mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🚀 Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý response và error
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.config.url, response.status);
    return response.data; // Trả về data trực tiếp
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Xử lý lỗi 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Thử refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post(
            `${baseURL}/auth/refresh`,
            { refreshToken }
          );
          
          const { accessToken } = response.data.data;
          
          // Lưu token mới
          localStorage.setItem('accessToken', accessToken);
          
          // Retry request với token mới
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token thất bại -> đăng xuất
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Redirect về trang login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Xử lý các lỗi khác
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('❌ Response Error:', errorMessage);
    
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;