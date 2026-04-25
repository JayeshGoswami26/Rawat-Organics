'use strict';

const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const roleRoutes = require('../modules/roles/role.routes');
const permissionRoutes = require('../modules/permissions/permission.routes');
const categoryRoutes = require('../modules/categories/category.routes');
const productRoutes = require('../modules/products/product.routes');
const inquiryRoutes = require('../modules/inquiries/inquiry.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');

const router = express.Router();

router.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV,
  });
});

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/roles', roleRoutes);
router.use('/api/v1/permissions', permissionRoutes);
router.use('/api/v1/categories', categoryRoutes);
router.use('/api/v1/products', productRoutes);
router.use('/api/v1/inquiries', inquiryRoutes);
router.use('/api/v1/analytics', analyticsRoutes);

module.exports = router;
