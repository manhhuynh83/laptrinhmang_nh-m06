// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { errorResponse, HTTP_STATUS } = require('../utils/response');
const { query } = require('../config/database');

/**
 * Middleware xác thực JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return errorResponse(
        res,
        'Access token is required',
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return errorResponse(
            res,
            'Token has expired',
            HTTP_STATUS.UNAUTHORIZED
          );
        }
        return errorResponse(
          res,
          'Invalid token',
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      
      // Kiểm tra user còn tồn tại và active
      const users = await query(
        'SELECT id, username, email, full_name, role, is_active FROM users WHERE id = ? AND is_active = TRUE',
        [decoded.userId]
      );
      
      if (users.length === 0) {
        return errorResponse(
          res,
          'User not found or inactive',
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      
      // Gán thông tin user vào request
      req.user = users[0];
      next();
    });
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    return errorResponse(
      res,
      'Authentication failed',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Middleware kiểm tra role admin
 */
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return errorResponse(
      res,
      'Admin access required',
      HTTP_STATUS.FORBIDDEN
    );
  }
  next();
};

/**
 * Middleware kiểm tra quyền sở hữu resource
 */
const checkOwnership = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    const resourceUserId = req[resourceUserIdField] || req.body[resourceUserIdField];
    
    // Admin có thể truy cập mọi resource
    if (req.user.role === 'admin') {
      return next();
    }
    
    // User thường chỉ truy cập resource của mình
    if (req.user.id !== parseInt(resourceUserId)) {
      return errorResponse(
        res,
        'You do not have permission to access this resource',
        HTTP_STATUS.FORBIDDEN
      );
    }
    
    next();
  };
};

/**
 * Optional authentication - không bắt buộc đăng nhập
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        req.user = null;
        return next();
      }
      
      const users = await query(
        'SELECT id, username, email, full_name, role FROM users WHERE id = ? AND is_active = TRUE',
        [decoded.userId]
      );
      
      req.user = users.length > 0 ? users[0] : null;
      next();
    });
    
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  checkOwnership,
  optionalAuth
};