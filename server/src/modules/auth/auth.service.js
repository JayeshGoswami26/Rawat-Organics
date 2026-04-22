'use strict';

const authRepository = require('./auth.repository');
const ApiError = require('../../utils/apiError');
const { hashPassword, comparePassword } = require('../../utils/bcrypt.util');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../../utils/jwt.util');
const { config } = require('../../config/environment');
const Role = require('../../models/role.model');
const { ROLES } = require('../../utils/constants');

class AuthService {
  async signup(data) {
    const existing = await authRepository.findUserByEmail(data.email);
    if (existing) throw ApiError.conflict('Email already registered');

    const [hashedPassword, customerRole] = await Promise.all([
      hashPassword(data.password),
      Role.findOne({ name: ROLES.CUSTOMER }).select('_id'),
    ]);

    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
      roles: customerRole ? [customerRole._id] : [],
    });

    return user;
  }

  async login(credentials, meta = {}) {
    const user = await authRepository.findUserByEmail(credentials.email, true);
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    // Check account lock using virtual — need raw fields
    const rawUser = await authRepository.findUserByIdWithPassword(user._id);
    if (rawUser.lockUntil && rawUser.lockUntil > Date.now()) {
      throw ApiError.unauthorized('Account temporarily locked due to too many failed attempts');
    }

    if (!user.isActive) throw ApiError.unauthorized('Account deactivated — contact support');

    const isValid = await comparePassword(credentials.password, rawUser.password);
    if (!isValid) {
      await authRepository.incrementLoginAttempts(user._id);
      throw ApiError.unauthorized('Invalid email or password');
    }

    await authRepository.updateLastLogin(user._id);

    const tokenPayload = { sub: user._id.toString() };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await authRepository.saveRefreshToken({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + config.jwt.refreshExpiresInMs),
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });

    return { accessToken, refreshToken, user: user.toJSON() };
  }

  async refreshTokens(refreshToken, meta = {}) {
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const stored = await authRepository.findRefreshToken(refreshToken);

    if (!stored || stored.isRevoked) {
      // Token reuse detected — revoke family to contain breach
      if (decoded?.sub) await authRepository.revokeAllUserTokens(decoded.sub);
      throw ApiError.unauthorized('Token reuse detected — please log in again');
    }

    if (stored.expiresAt < new Date()) {
      throw ApiError.unauthorized('Refresh token expired');
    }

    const user = await authRepository.findUserById(decoded.sub);
    if (!user || !user.isActive) throw ApiError.unauthorized('User not found');

    const payload = { sub: user._id.toString() };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Rotate: revoke old, issue new
    await Promise.all([
      authRepository.revokeRefreshToken(refreshToken, newRefreshToken),
      authRepository.saveRefreshToken({
        token: newRefreshToken,
        user: user._id,
        expiresAt: new Date(Date.now() + config.jwt.refreshExpiresInMs),
        ipAddress: meta.ip,
        userAgent: meta.userAgent,
      }),
    ]);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken) {
    await authRepository.revokeRefreshToken(refreshToken);
  }

  async logoutAll(userId) {
    await authRepository.revokeAllUserTokens(userId);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await authRepository.findUserByIdWithPassword(userId);
    if (!user) throw ApiError.notFound('User not found');

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

    const hashed = await hashPassword(newPassword);
    await Promise.all([
      authRepository.updatePassword(userId, hashed),
      authRepository.revokeAllUserTokens(userId),
    ]);
  }

  async getProfile(userId) {
    const user = await authRepository.findUserById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }
}

module.exports = new AuthService();
