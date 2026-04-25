'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const logger = require('./config/logger');
const { config } = require('./config/environment');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');
const { errorMiddleware, notFoundMiddleware } = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

// Nginx/load-balancer trust
app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: config.env === 'production',
    crossOriginEmbedderPolicy: config.env === 'production',
  })
);

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id'],
  })
);

// Body parsers (hard limit to avoid large payload attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// NoSQL injection prevention
app.use(mongoSanitize());

// HTTP parameter pollution prevention
app.use(hpp());

// Gzip
app.use(compression());

// HTTP request logging
const morganStream = { write: (msg) => logger.http(msg.trimEnd()) };
app.use(morgan(config.env === 'production' ? 'combined' : 'dev', { stream: morganStream }));

// Global rate limiter
app.use(globalLimiter);

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API routes
app.use(routes);

// 404 catch-all
app.use(notFoundMiddleware);

// Centralised error handler (must be last)
app.use(errorMiddleware);

module.exports = app;
