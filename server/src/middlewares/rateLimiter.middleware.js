'use strict';

const rateLimit = require('express-rate-limit');
const { config } = require('../config/environment');

const createLimiter = ({ windowMs, max, message } = {}) =>
  rateLimit({
    windowMs: windowMs || config.rateLimit.windowMs,
    max: max || config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        statusCode: 429,
        message: message || 'Too many requests — please try again later',
      });
    },
  });

// Applied globally to every route
const globalLimiter = createLimiter({});

// Strict limiter for auth endpoints (login, signup, refresh)
const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many auth attempts — please try again after 15 minutes',
});

// Very strict — for sensitive actions like change-password
const strictLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests to this endpoint',
});

module.exports = { globalLimiter, authLimiter, strictLimiter };
