'use strict';

const jwt = require('jsonwebtoken');
const { config } = require('../config/environment');

const JWT_OPTIONS = {
  issuer: 'rawat-organics',
  audience: 'rawat-organics-client',
};

const generateAccessToken = (payload) =>
  jwt.sign(payload, config.jwt.accessSecret, {
    ...JWT_OPTIONS,
    expiresIn: config.jwt.accessExpiresIn,
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, config.jwt.refreshSecret, {
    ...JWT_OPTIONS,
    expiresIn: config.jwt.refreshExpiresIn,
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, config.jwt.accessSecret, JWT_OPTIONS);

const verifyRefreshToken = (token) =>
  jwt.verify(token, config.jwt.refreshSecret, JWT_OPTIONS);

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
