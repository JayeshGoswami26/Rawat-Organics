'use strict';

const express = require('express');
const roleController = require('./role.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const validate = require('../../middlewares/validate.middleware');
const { createRoleSchema, updateRoleSchema, permissionIdsSchema } = require('./role.validator');
const { PERMISSIONS } = require('../../utils/constants');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.ROLES_READ), roleController.getAll);
router.get('/:id', authorize(PERMISSIONS.ROLES_READ), roleController.getById);
router.post('/', authorize(PERMISSIONS.ROLES_CREATE), validate(createRoleSchema), roleController.create);
router.patch('/:id', authorize(PERMISSIONS.ROLES_UPDATE), validate(updateRoleSchema), roleController.update);

// PUT replaces the entire permission set; POST adds; DELETE removes
router.put('/:id/permissions', authorize(PERMISSIONS.ROLES_UPDATE), validate(permissionIdsSchema), roleController.setPermissions);
router.post('/:id/permissions', authorize(PERMISSIONS.ROLES_UPDATE), validate(permissionIdsSchema), roleController.addPermissions);
router.delete('/:id/permissions', authorize(PERMISSIONS.ROLES_UPDATE), validate(permissionIdsSchema), roleController.removePermissions);

router.delete('/:id', authorize(PERMISSIONS.ROLES_DELETE), roleController.delete);

module.exports = router;
