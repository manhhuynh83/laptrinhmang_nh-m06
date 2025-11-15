// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const { successResponse, errorResponse, authResponse, HTTP_STATUS } = require('../utils/response');
const { validateLogin, validateRegister, sanitizeInput } = require('../utils/validation');

/**
 * Generate JWT tokens
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  
  return {
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  };
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;
    
    // Validate input
    const validation = validateRegister(req.body);
    if (!validation.isValid) {
      return errorResponse(
        res,
        'Validation failed',
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        validation.errors
      );
    }
    
    // Sanitize input
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedFullName = sanitizeInput(full_name);
    
    // Check if user exists
    const existingUsers = await query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [sanitizedUsername, sanitizedEmail]
    );
    
    if (existingUsers.length > 0) {
      return errorResponse(
        res,
        'Username or email already exists',
        HTTP_STATUS.CONFLICT
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const result = await query(
      'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
      [sanitizedUsername, sanitizedEmail, hashedPassword, sanitizedFullName]
    );
    
    // Get created user
    const newUser = await query(
      'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );
    
    // Generate tokens
    const tokens = generateTokens(newUser[0].id);
    
    // Save refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [newUser[0].id, tokens.refreshToken, expiresAt]
    );
    
    return authResponse(res, newUser[0], tokens, 'Registration successful');
    
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(
      res,
      'Registration failed',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    const validation = validateLogin(req.body);
    if (!validation.isValid) {
      return errorResponse(
        res,
        'Validation failed',
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        validation.errors
      );
    }
    
    // Find user
    const users = await query(
      'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
      [sanitizeInput(email)]
    );
    
    if (users.length === 0) {
      return errorResponse(
        res,
        'Invalid email or password',
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    
    const user = users[0];
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(
        res,
        'Invalid email or password',
        HTTP_STATUS.UNAUTHORIZED
      );
    }
    
    // Generate tokens
    const tokens = generateTokens(user.id);
    
    // Save refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, tokens.refreshToken, expiresAt]
    );
    
    // Update last login
    await query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );
    
    return authResponse(res, user, tokens, 'Login successful');
    
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(
      res,
      'Login failed',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return errorResponse(
        res,
        'Refresh token is required',
        HTTP_STATUS.BAD_REQUEST
      );
    }
    
    // Delete refresh token
    await query(
      'DELETE FROM refresh_tokens WHERE token = ? AND user_id = ?',
      [refreshToken, req.user.id]
    );
    
    return successResponse(res, null, 'Logout successful');
    
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse(
      res,
      'Logout failed',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return errorResponse(
        res,
        'Refresh token is required',
        HTTP_STATUS.BAD_REQUEST
      );
    }
    
    // Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return errorResponse(
          res,
          'Invalid or expired refresh token',
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      
      // Check if refresh token exists in database
      const tokens = await query(
        'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()',
        [refreshToken, decoded.userId]
      );
      
      if (tokens.length === 0) {
        return errorResponse(
          res,
          'Refresh token not found or expired',
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      
      // Generate new access token
      const newTokens = generateTokens(decoded.userId);
      
      return successResponse(
        res,
        {
          accessToken: newTokens.accessToken,
          expiresIn: newTokens.expiresIn
        },
        'Token refreshed successfully'
      );
    });
    
  } catch (error) {
    console.error('Refresh token error:', error);
    return errorResponse(
      res,
      'Token refresh failed',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user info
 * @access  Private
 */
const getCurrentUser = async (req, res) => {
  try {
    const users = await query(
      'SELECT id, username, email, full_name, avatar, role, created_at, last_login FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return errorResponse(
        res,
        'User not found',
        HTTP_STATUS.NOT_FOUND
      );
    }
    
    return successResponse(res, users[0], 'User retrieved successfully');
    
  } catch (error) {
    console.error('Get current user error:', error);
    return errorResponse(
      res,
      'Failed to get user info',
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser
};