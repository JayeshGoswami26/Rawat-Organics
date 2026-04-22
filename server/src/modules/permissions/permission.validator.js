'use strict';

const Joi = require('joi');

const createPermissionSchema = Joi.object({
  resource: Joi.string().trim().lowercase().min(2).max(50).required(),
  action: Joi.string().valid('read', 'create', 'update', 'delete', 'manage').required(),
  description: Joi.string().trim().max(200).optional(),
});

const updatePermissionSchema = Joi.object({
  description: Joi.string().trim().max(200).required(),
});

module.exports = { createPermissionSchema, updatePermissionSchema };
