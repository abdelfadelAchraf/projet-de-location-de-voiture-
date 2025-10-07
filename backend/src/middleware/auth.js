

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';


// Protect routes - verify JWT token
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return ApiResponse.unauthorized(res, 'Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return ApiResponse.unauthorized(res, 'User not found');
    }

    if (!req.user.isActive) {
      return ApiResponse.forbidden(res, 'Your account has been deactivated');
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ApiResponse.unauthorized(res, 'Token expired, please login again');
    }
    return ApiResponse.unauthorized(res, 'Not authorized to access this route');
  }
});

// Optional authentication - doesn't fail if no token
exports.optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token invalid, continue without user
      req.user = null;
    }
  }

  next();
});

// Verify refresh token
exports.verifyRefreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return ApiResponse.badRequest(res, 'Refresh token is required');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return ApiResponse.unauthorized(res, 'Invalid refresh token');
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.unauthorized(res, 'Invalid or expired refresh token');
  }
});

export default exports;