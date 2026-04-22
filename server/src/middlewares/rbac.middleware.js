'use strict';

const ApiError = require('../utils/apiError');

/**
 * Require all listed permissions (AND logic).
 * Usage: authorize('users:read', 'users:update')
 */
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());

    const userPermissions = new Set();
    for (const role of req.user.roles) {
      for (const perm of role.permissions) {
        userPermissions.add(perm.name);
      }
    }

    const hasAll = requiredPermissions.every((p) => userPermissions.has(p));
    if (!hasAll) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }

    next();
  };
};

/**
 * Require at least one of the listed roles (OR logic).
 * Usage: authorizeRoles('admin', 'super_admin')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return next(ApiError.unauthorized());

    const userRoles = req.user.roles.map((r) => r.name);
    const hasRole = allowedRoles.some((r) => userRoles.includes(r));
    if (!hasRole) {
      return next(ApiError.forbidden('Insufficient role'));
    }

    next();
  };
};

module.exports = { authorize, authorizeRoles };
