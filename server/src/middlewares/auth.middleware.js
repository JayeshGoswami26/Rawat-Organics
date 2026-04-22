'use strict';

const ApiError = require('../utils/apiError');
const { verifyAccessToken } = require('../utils/jwt.util');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/user.model');

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Access token required');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.sub).populate({
    path: 'roles',
    select: 'name permissions isActive',
    match: { isActive: true },
    populate: {
      path: 'permissions',
      select: 'name resource action',
    },
  });

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User not found or deactivated');
  }

  // Invalidate tokens issued before a password change
  if (user.passwordChangedAt) {
    const changedAt = Math.floor(user.passwordChangedAt.getTime() / 1000);
    if (decoded.iat < changedAt) {
      throw ApiError.unauthorized('Password recently changed — please log in again');
    }
  }

  req.user = user;
  next();
});

module.exports = { authenticate };
