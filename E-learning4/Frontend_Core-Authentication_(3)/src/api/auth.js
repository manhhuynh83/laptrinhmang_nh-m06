import axiosInstance from './axiosInstance';

// Mock API - Tạm thời dùng dữ liệu giả để test
const mockUser = {
  id: 1,
  name: 'Demo User', 
  email: 'demo@quickplay.com',
  created_at: new Date().toISOString()
};

export const authAPI = {
  login: async (credentials) => {
    console.log('Login attempt:', credentials);
    
    // Giả lập API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          resolve({
            data: {
              token: 'mock-jwt-token-' + Date.now(),
              user: mockUser
            }
          });
        } else {
          reject({
            response: {
              data: { message: 'Email và mật khẩu không được để trống' }
            }
          });
        }
      }, 1000);
    });
  },
  
  register: async (userData) => {
    console.log('Register attempt:', userData);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.email && userData.password && userData.name) {
          if (userData.password !== userData.password_confirmation) {
            reject({
              response: {
                data: { message: 'Mật khẩu xác nhận không khớp' }
              }
            });
            return;
          }
          
          resolve({
            data: {
              message: 'Đăng ký thành công!',
              user: { ...mockUser, name: userData.name, email: userData.email }
            }
          });
        } else {
          reject({
            response: {
              data: { message: 'Vui lòng điền đầy đủ thông tin' }
            }
          });
        }
      }, 1000);
    });
  },
  
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Đăng xuất thành công' } });
      }, 500);
    });
  },
  
  getProfile: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: mockUser
          }
        });
      }, 500);
    });
  }
};