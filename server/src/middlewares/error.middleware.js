'use strict';

const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

const handleCastError = (err) =>
  ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return ApiError.conflict(`${field} already exists`);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return ApiError.badRequest('Validation failed', errors);
};

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  if (err instanceof mongoose.Error.CastError) error = handleCastError(err);
  else if (err.code === 11000) error = handleDuplicateKeyError(err);
  else if (err instanceof mongoose.Error.ValidationError) error = handleValidationError(err);
  else if (err.name === 'JsonWebTokenError') error = ApiError.unauthorized('Invalid token');
  else if (err.name === 'TokenExpiredError') error = ApiError.unauthorized('Token expired');
  else if (!(err instanceof ApiError)) {
    error = ApiError.internal(
      process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    );
  }

  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    logger.error({
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  }

  const body = {
    success: false,
    statusCode,
    message: error.message,
  };

  if (error.errors?.length) body.errors = error.errors;
  if (process.env.NODE_ENV !== 'production') body.stack = error.stack;

  return res.status(statusCode).json(body);
};

const notFoundMiddleware = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

module.exports = { errorMiddleware, notFoundMiddleware };
