'use strict';

const express = require('express');
const analyticsController = require('./analytics.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const { createLimiter } = require('../../middlewares/rateLimiter.middleware');
const { PERMISSIONS } = require('../../utils/constants');

const router = express.Router();

// Rate limit tracking: 60 events per minute per IP to prevent abuse
const trackLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: 'Too many tracking events',
});

// Public — track a page view
router.post('/track', trackLimiter, analyticsController.track);

// Protected — admin dashboard endpoints
router.use(authenticate);
router.use(authorize(PERMISSIONS.ANALYTICS_READ));

router.get('/overview', analyticsController.overview);
router.get('/landing-page', analyticsController.landingPage);
router.get('/categories', analyticsController.categories);
router.get('/products', analyticsController.products);

module.exports = router;
