
import crypto from 'crypto';
import User from '../models/User.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import emailService from '../services/emailService.js';


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone, dateOfBirth } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return ApiResponse.conflict(res, 'User with this email already exists');
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    dateOfBirth,
  });

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save();

  // Send verification email
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  await emailService.sendVerificationEmail(user.email, verificationUrl);

  // Generate tokens
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  // Remove password from output
  user.password = undefined;

  return ApiResponse.created(res, {
    user,
    accessToken,
    refreshToken,
  }, 'Registration successful. Please check your email to verify your account');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return ApiResponse.badRequest(res, 'Please provide email and password');
  }

  // Check user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return ApiResponse.unauthorized(res, 'Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    return ApiResponse.forbidden(res, 'Your account has been deactivated');
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return ApiResponse.unauthorized(res, 'Invalid credentials');
  }

  // Update last login
  user.lastLogin = Date.now();

  // Generate tokens
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  // Remove password from output
  user.password = undefined;

  return ApiResponse.success(res, {
    user,
    accessToken,
    refreshToken,
  }, 'Login successful');
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  req.user.refreshToken = undefined;
  await req.user.save();

  return ApiResponse.success(res, null, 'Logout successful');
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const user = req.user;

  // Generate new tokens
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return ApiResponse.success(res, {
    accessToken,
    refreshToken,
  }, 'Token refreshed successfully');
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return ApiResponse.notFound(res, 'No user found with that email');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send email
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await emailService.sendPasswordResetEmail(user.email, resetUrl);

  return ApiResponse.success(res, null, 'Password reset email sent');
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  // Hash token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return ApiResponse.badRequest(res, 'Invalid or expired reset token');
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return ApiResponse.success(res, null, 'Password reset successful');
});

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  // Hash token
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return ApiResponse.badRequest(res, 'Invalid or expired verification token');
  }

  // Verify email
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return ApiResponse.success(res, null, 'Email verified successfully');
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-refreshToken');
  return ApiResponse.success(res, user);
});

export default { register, login, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, getMe };