'use strict';

const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
  pageType: {
    type: String,
    enum: ['landing', 'category', 'product', 'other'],
    required: [true, 'Page type is required'],
  },
  path: {
    type: String,
    required: [true, 'Path is required'],
    trim: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  sessionId: { type: String, trim: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  referrer: { type: String, trim: true },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Auto-delete documents after 90 days
pageViewSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });
pageViewSchema.index({ pageType: 1, timestamp: -1 });
pageViewSchema.index({ product: 1, timestamp: -1 });
pageViewSchema.index({ category: 1, timestamp: -1 });

module.exports = mongoose.model('PageView', pageViewSchema);
