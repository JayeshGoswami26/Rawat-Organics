'use strict';

const Product = require('../../models/product.model');
const { getPagination, getPaginationMeta } = require('../../utils/pagination.util');

const CATEGORY_SELECT = 'name slug image';

class ProductRepository {
  async findAll({ filter = {}, page, limit: limitParam, sort = { createdAt: -1 } }) {
    const { page: p, limit, skip } = getPagination({ page, limit: limitParam });

    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate('category', CATEGORY_SELECT)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return { items, meta: getPaginationMeta(total, p, limit) };
  }

  findBySlug(slug) {
    return Product.findOne({ slug, isActive: true })
      .populate('category', CATEGORY_SELECT)
      .lean();
  }

  findById(id) {
    return Product.findById(id);
  }

  findBySlugExcludingId(slug, excludeId) {
    return Product.findOne({ slug, _id: { $ne: excludeId } });
  }

  create(data) {
    return Product.create(data);
  }

  updateById(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
      'category',
      CATEGORY_SELECT
    );
  }
}

module.exports = new ProductRepository();
