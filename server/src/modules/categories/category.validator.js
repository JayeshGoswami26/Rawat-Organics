'use strict';

const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  description: Joi.string().trim().max(500).optional().allow(''),
  sortOrder: Joi.number().integer().min(0).optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).optional(),
  description: Joi.string().trim().max(500).optional().allow(''),
  sortOrder: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

module.exports = { createCategorySchema, updateCategorySchema };
