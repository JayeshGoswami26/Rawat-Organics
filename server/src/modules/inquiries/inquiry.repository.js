'use strict';

const Inquiry = require('../../models/inquiry.model');
const { getPagination, getPaginationMeta } = require('../../utils/pagination.util');

const POPULATE_REFS = [
  { path: 'product', select: 'name slug' },
  { path: 'category', select: 'name slug' },
];

class InquiryRepository {
  async findAll({ filter = {}, page, limit: limitParam }) {
    const { page: p, limit, skip } = getPagination({ page, limit: limitParam });

    const [items, total] = await Promise.all([
      Inquiry.find(filter)
        .populate(POPULATE_REFS)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(filter),
    ]);

    return { items, meta: getPaginationMeta(total, p, limit) };
  }

  findById(id) {
    return Inquiry.findById(id).populate(POPULATE_REFS);
  }

  create(data) {
    return Inquiry.create(data);
  }

  updateById(id, data) {
    return Inquiry.findByIdAndUpdate(id, data, { new: true }).populate(POPULATE_REFS);
  }
}

module.exports = new InquiryRepository();
