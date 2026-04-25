'use strict';

const Category = require('../../models/category.model');

class CategoryRepository {
  findAll({ filter = {}, sort = { sortOrder: 1, createdAt: 1 } } = {}) {
    return Category.find(filter).sort(sort).lean();
  }

  findBySlug(slug) {
    return Category.findOne({ slug, isActive: true }).lean();
  }

  findById(id) {
    return Category.findById(id);
  }

  findByName(name) {
    return Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
  }

  findBySlugExcludingId(slug, excludeId) {
    return Category.findOne({ slug, _id: { $ne: excludeId } });
  }

  create(data) {
    return Category.create(data);
  }

  updateById(id, data) {
    return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }
}

module.exports = new CategoryRepository();
