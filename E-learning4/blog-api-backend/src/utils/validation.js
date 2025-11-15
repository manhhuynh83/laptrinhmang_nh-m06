// src/utils/validation.js

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * - Ít nhất 8 ký tự
 * - Có chữ hoa, chữ thường, số
 */
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate username
 * - Chỉ chứa chữ, số, underscore
 * - 3-20 ký tự
 */
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validate required fields
 */
const validateRequired = (fields, data) => {
  const errors = [];
  
  fields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate login data
 */
const validateLogin = (data) => {
  const errors = [];
  
  if (!data.email || !data.email.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (!data.password || !data.password.trim()) {
    errors.push('Password is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate register data
 */
const validateRegister = (data) => {
  const errors = [];
  
  // Username
  if (!data.username || !data.username.trim()) {
    errors.push('Username is required');
  } else if (!isValidUsername(data.username)) {
    errors.push('Username must be 3-20 characters and contain only letters, numbers, and underscores');
  }
  
  // Email
  if (!data.email || !data.email.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  // Password
  if (!data.password || !data.password.trim()) {
    errors.push('Password is required');
  } else if (!isValidPassword(data.password)) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, and numbers');
  }
  
  // Full name
  if (!data.full_name || !data.full_name.trim()) {
    errors.push('Full name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize input (xóa các ký tự đặc biệt nguy hiểm)
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Loại bỏ < và >
    .replace(/javascript:/gi, '') // Loại bỏ javascript:
    .replace(/on\w+=/gi, ''); // Loại bỏ event handlers
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  validateRequired,
  validateLogin,
  validateRegister,
  sanitizeInput
};