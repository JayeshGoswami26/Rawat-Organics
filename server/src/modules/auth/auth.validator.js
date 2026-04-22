'use strict';

const Joi = require('joi');

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
const PASSWORD_PATTERN_MSG =
  'Password must contain at least one uppercase letter, lowercase letter, number, and special character (@$!%*?&)';

const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(PASSWORD_PATTERN)
  .required()
  .messages({ 'string.pattern.base': PASSWORD_PATTERN_MSG });

const signupSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password,
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: password,
});

module.exports = { signupSchema, loginSchema, refreshTokenSchema, changePasswordSchema };
