'use strict';

const express = require('express');
const userController = require('./user.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const validate = require('../../middlewares/validate.middleware');
const { updateUserSchema, assignRolesSchema, toggleStatusSchema } = require('./user.validator');
const { PERMISSIONS } = require('../../utils/constants');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.USERS_READ), userController.getAll);
router.get('/:id', authorize(PERMISSIONS.USERS_READ), userController.getById);
router.patch('/:id', authorize(PERMISSIONS.USERS_UPDATE), validate(updateUserSchema), userController.update);
router.put('/:id/roles', authorize(PERMISSIONS.USERS_UPDATE), validate(assignRolesSchema), userController.setRoles);
router.patch('/:id/status', authorize(PERMISSIONS.USERS_UPDATE), validate(toggleStatusSchema), userController.toggleStatus);
router.delete('/:id', authorize(PERMISSIONS.USERS_DELETE), userController.delete);

module.exports = router;
