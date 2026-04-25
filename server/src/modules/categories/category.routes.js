'use strict';

const express = require('express');
const categoryController = require('./category.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const validate = require('../../middlewares/validate.middleware');
const { uploadSingle } = require('../../middlewares/upload.middleware');
const { createCategorySchema, updateCategorySchema } = require('./category.validator');
const { PERMISSIONS } = require('../../utils/constants');

const router = express.Router();

// Public
router.get('/', categoryController.getAll);
router.get('/:slug', categoryController.getBySlug);

// Protected — admin only
router.use(authenticate);

router.post(
  '/',
  authorize(PERMISSIONS.CATEGORIES_CREATE),
  uploadSingle('image'),
  validate(createCategorySchema),
  categoryController.create
);

router.patch(
  '/:id',
  authorize(PERMISSIONS.CATEGORIES_UPDATE),
  uploadSingle('image'),
  validate(updateCategorySchema),
  categoryController.update
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.CATEGORIES_DELETE),
  categoryController.remove
);

module.exports = router;
