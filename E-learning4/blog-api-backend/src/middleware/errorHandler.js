// src/middleware/errorHandler.js
const { errorResponse, HTTP_STATUS } = require('../utils/response');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    return errorResponse(
      res,
      'Duplicate entry. This record already exists',
      HTTP_STATUS.CONFLICT,
      { detail: err.sqlMessage }
    );
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return errorResponse(
      res,
      'Referenced record does not exist',
      HTTP_STATUS.BAD_REQUEST
    );
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(
      res,
      'Invalid token',
      HTTP_STATUS.UNAUTHORIZED
    );
  }
  
  if (err.name === 'TokenExpiredError') {
    return errorResponse(
      res,
      'Token expired',
      HTTP_STATUS.UNAUTHORIZED
    );
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return errorResponse(
      res,
      'Validation failed',
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      err.errors
    );
  }
  
  // Default error
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal server error';
  
  return errorResponse(res, message, statusCode);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  return errorResponse(
    res,
    `Route ${req.originalUrl} not found`,
    HTTP_STATUS.NOT_FOUND
  );
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};