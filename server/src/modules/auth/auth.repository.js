'use strict';

const User = require('../../models/user.model');
const RefreshToken = require('../../models/refreshToken.model');

const ROLES_POPULATE = {
  path: 'roles',
  select: 'name permissions isActive',
  match: { isActive: true },
  populate: { path: 'permissions', select: 'name resource action' },
};

class AuthRepository {
  findUserByEmail(email, withPassword = false) {
    const q = User.findOne({ email }).populate(ROLES_POPULATE);
    return withPassword ? q.select('+password') : q;
  }

  findUserById(id) {
    return User.findById(id).populate(ROLES_POPULATE);
  }

  findUserByIdWithPassword(id) {
    return User.findById(id).select('+password +loginAttempts +lockUntil');
  }

  createUser(data) {
    return User.create(data);
  }

  updateLastLogin(userId) {
    return User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
      loginAttempts: 0,
      lockUntil: null,
    });
  }

  async incrementLoginAttempts(userId) {
    const MAX_ATTEMPTS = 5;
    const LOCK_DURATION_MS = 30 * 60 * 1000;

    const user = await User.findById(userId).select('+loginAttempts +lockUntil');
    if (!user) return;

    // Reset if previous lock has expired
    if (user.lockUntil && user.lockUntil < Date.now()) {
      return User.findByIdAndUpdate(userId, { loginAttempts: 1, lockUntil: null });
    }

    const updates = { $inc: { loginAttempts: 1 } };
    if (user.loginAttempts + 1 >= MAX_ATTEMPTS) {
      updates.$set = { lockUntil: new Date(Date.now() + LOCK_DURATION_MS) };
    }

    return User.findByIdAndUpdate(userId, updates, { new: true });
  }

  updatePassword(userId, hashedPassword) {
    return User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    });
  }

  saveRefreshToken(data) {
    return RefreshToken.create(data);
  }

  findRefreshToken(token) {
    return RefreshToken.findOne({ token });
  }

  revokeRefreshToken(token, replacedByToken = null) {
    const update = { isRevoked: true };
    if (replacedByToken) update.replacedByToken = replacedByToken;
    return RefreshToken.findOneAndUpdate({ token }, update);
  }

  revokeAllUserTokens(userId) {
    return RefreshToken.updateMany({ user: userId, isRevoked: false }, { isRevoked: true });
  }
}

module.exports = new AuthRepository();
