'use strict';

const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const categoryRepository = require('./category.repository');
const Product = require('../../models/product.model');
const ApiError = require('../../utils/apiError');
const { UPLOADS_DIR } = require('../../middlewares/upload.middleware');

const buildImageUrl = (req, filename) =>
  `${req.protocol}://${req.get('host')}/uploads/${filename}`;

class CategoryService {
  async getAllCategories(includeInactive = false) {
    const filter = includeInactive ? {} : { isActive: true };
    return categoryRepository.findAll({ filter });
  }

  async getCategoryBySlug(slug) {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) throw ApiError.notFound('Category not found');
    return category;
  }

  async createCategory(data, file, userId, req) {
    const existing = await categoryRepository.findByName(data.name);
    if (existing) throw ApiError.conflict('Category with this name already exists');

    const payload = { ...data, createdBy: userId };

    if (file) {
      payload.image = {
        url: buildImageUrl(req, file.filename),
        filename: file.filename,
      };
    }

    return categoryRepository.create(payload);
  }

  async updateCategory(id, data, file, req) {
    const category = await categoryRepository.findById(id);
    if (!category) throw ApiError.notFound('Category not found');

    if (data.name && data.name !== category.name) {
      const newSlug = slugify(data.name, { lower: true, strict: true });
      const conflict = await categoryRepository.findBySlugExcludingId(newSlug, id);
      if (conflict) throw ApiError.conflict('Another category with this name already exists');
    }

    if (file) {
      // Remove old image file from disk
      if (category.image?.filename) {
        const oldPath = path.join(UPLOADS_DIR, category.image.filename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.image = {
        url: buildImageUrl(req, file.filename),
        filename: file.filename,
      };
    }

    return categoryRepository.updateById(id, data);
  }

  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) throw ApiError.notFound('Category not found');

    const productCount = await Product.countDocuments({ category: id, isActive: true });
    if (productCount > 0) {
      throw ApiError.badRequest(
        `Cannot deactivate category with ${productCount} active product(s). Deactivate or reassign products first.`
      );
    }

    return categoryRepository.updateById(id, { isActive: false });
  }
}

module.exports = new CategoryService();
