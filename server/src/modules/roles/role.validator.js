'use strict';

const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const createRoleSchema = Joi.object({
  name: Joi.string().trim().lowercase().min(2).max(50).required(),
  displayName: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(300).optional(),
  permissions: Joi.array().items(objectId).default([]),
});

const updateRoleSchema = Joi.object({
  displayName: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().trim().max(300).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

const permissionIdsSchema = Joi.object({
  permissions: Joi.array().items(objectId).min(1).required(),
});

module.exports = { createRoleSchema, updateRoleSchema, permissionIdsSchema };
