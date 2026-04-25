'use strict';

const express = require('express');
const inquiryController = require('./inquiry.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const validate = require('../../middlewares/validate.middleware');
const { createLimiter } = require('../../middlewares/rateLimiter.middleware');
const { createInquirySchema, updateStatusSchema } = require('./inquiry.validator');
const { PERMISSIONS } = require('../../utils/constants');

const router = express.Router();

// Rate limit public inquiry submissions: 5 per hour per IP
const inquiryLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many inquiries submitted — please try again in an hour',
});

// Public — submit an inquiry
router.post('/', inquiryLimiter, validate(createInquirySchema), inquiryController.create);

// Protected — admin access
router.use(authenticate);

router.get('/', authorize(PERMISSIONS.INQUIRIES_READ), inquiryController.getAll);
router.get('/:id', authorize(PERMISSIONS.INQUIRIES_READ), inquiryController.getById);
router.patch(
  '/:id/status',
  authorize(PERMISSIONS.INQUIRIES_UPDATE),
  validate(updateStatusSchema),
  inquiryController.updateStatus
);

module.exports = router;
