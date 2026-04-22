'use strict';

const express = require('express');
const authController = require('./auth.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authLimiter, strictLimiter } = require('../../middlewares/rateLimiter.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
  signupSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} = require('./auth.validator');

const router = express.Router();

// Public
router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', authLimiter, validate(refreshTokenSchema), authController.refreshTokens);
router.post('/logout', validate(refreshTokenSchema), authController.logout);

// Protected
router.use(authenticate);
router.post('/logout-all', authController.logoutAll);
router.get('/profile', authController.getProfile);
router.patch('/change-password', strictLimiter, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
