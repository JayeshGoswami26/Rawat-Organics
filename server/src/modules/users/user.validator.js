'use strict';

const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).optional(),
  lastName: Joi.string().trim().min(2).max(50).optional(),
}).min(1);

const assignRolesSchema = Joi.object({
  roles: Joi.array().items(objectId).min(1).required(),
});

const toggleStatusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});

module.exports = { updateUserSchema, assignRolesSchema, toggleStatusSchema };
