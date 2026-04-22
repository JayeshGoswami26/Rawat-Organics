'use strict';

const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');

class AuthController {
  signup = asyncHandler(async (req, res) => {
    const user = await authService.signup(req.body);
    ApiResponse.created(res, 'Account created successfully', { user });
  });

  login = asyncHandler(async (req, res) => {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const { accessToken, refreshToken, user } = await authService.login(req.body, meta);
    ApiResponse.success(res, 'Login successful', { accessToken, refreshToken, user });
  });

  refreshTokens = asyncHandler(async (req, res) => {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const tokens = await authService.refreshTokens(req.body.refreshToken, meta);
    ApiResponse.success(res, 'Tokens refreshed', tokens);
  });

  logout = asyncHandler(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    ApiResponse.success(res, 'Logged out successfully');
  });

  logoutAll = asyncHandler(async (req, res) => {
    await authService.logoutAll(req.user._id);
    ApiResponse.success(res, 'Logged out from all devices');
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    ApiResponse.success(res, 'Password changed — please log in again');
  });

  getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user._id);
    ApiResponse.success(res, 'Profile retrieved', { user });
  });
}

module.exports = new AuthController();
