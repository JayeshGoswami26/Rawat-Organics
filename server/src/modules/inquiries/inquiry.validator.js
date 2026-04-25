'use strict';

const Joi = require('joi');

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .message('Must be a valid ObjectId');

const createInquirySchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().lowercase().required(),
  phone: Joi.string().trim().max(20).optional().allow(''),
  company: Joi.string().trim().max(100).optional().allow(''),
  message: Joi.string().trim().min(10).max(2000).required(),
  inquiryType: Joi.string()
    .valid('general', 'product', 'wholesale', 'other')
    .optional()
    .default('general'),
  productId: objectId.optional(),
  categoryId: objectId.optional(),
  source: Joi.string().trim().max(200).optional().allow(''),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('new', 'read', 'replied', 'archived').required(),
  adminNotes: Joi.string().trim().max(1000).optional().allow(''),
});

module.exports = { createInquirySchema, updateStatusSchema };
