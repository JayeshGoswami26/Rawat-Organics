'use strict';

const Joi = require('joi');

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message('Must be a valid ObjectId');

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  categoryId: objectId.required(),
  description: Joi.string().trim().min(10).max(2000).required(),
  shortDescription: Joi.string().trim().max(200).optional().allow(''),
  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),
  attributes: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().trim().required(),
        value: Joi.string().trim().required(),
      })
    )
    .optional(),
  isFeatured: Joi.boolean().optional(),
  removeImages: Joi.array().items(Joi.string()).optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  categoryId: objectId.optional(),
  description: Joi.string().trim().min(10).max(2000).optional(),
  shortDescription: Joi.string().trim().max(200).optional().allow(''),
  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),
  attributes: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().trim().required(),
        value: Joi.string().trim().required(),
      })
    )
    .optional(),
  isFeatured: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  removeImages: Joi.array().items(Joi.string()).optional(),
}).min(1);

module.exports = { createProductSchema, updateProductSchema };
