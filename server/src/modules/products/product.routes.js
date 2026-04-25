'use strict';

const express = require('express');
const productController = require('./product.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const validate = require('../../middlewares/validate.middleware');
const { uploadMultiple } = require('../../middlewares/upload.middleware');
const { createProductSchema, updateProductSchema } = require('./product.validator');
const { PERMISSIONS } = require('../../utils/constants');

const router = express.Router();

// Public
router.get('/', productController.getAll);
router.get('/:slug', productController.getBySlug);

// Protected — admin only
router.use(authenticate);

router.post(
  '/',
  authorize(PERMISSIONS.PRODUCTS_CREATE),
  uploadMultiple('images', 5),
  validate(createProductSchema),
  productController.create
);

router.patch(
  '/:id',
  authorize(PERMISSIONS.PRODUCTS_UPDATE),
  uploadMultiple('images', 5),
  validate(updateProductSchema),
  productController.update
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.PRODUCTS_DELETE),
  productController.remove
);

module.exports = router;
