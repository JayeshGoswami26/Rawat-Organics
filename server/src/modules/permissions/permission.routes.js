'use strict';

const express = require('express');
const permissionController = require('./permission.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');
const validate = require('../../middlewares/validate.middleware');
const { createPermissionSchema, updatePermissionSchema } = require('./permission.validator');
const { PERMISSIONS } = require('../../utils/constants');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize(PERMISSIONS.PERMISSIONS_READ), permissionController.getAll);
router.get('/:id', authorize(PERMISSIONS.PERMISSIONS_READ), permissionController.getById);
router.post('/', authorize(PERMISSIONS.PERMISSIONS_CREATE), validate(createPermissionSchema), permissionController.create);
router.patch('/:id', authorize(PERMISSIONS.PERMISSIONS_UPDATE), validate(updatePermissionSchema), permissionController.update);
router.delete('/:id', authorize(PERMISSIONS.PERMISSIONS_DELETE), permissionController.delete);

module.exports = router;
