'use strict';

const Permission = require('../../models/permission.model');
const { getPagination, getPaginationMeta } = require('../../utils/pagination.util');

class PermissionRepository {
  async findAll(query = {}) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};
    if (query.resource) filter.resource = query.resource;
    if (query.action) filter.action = query.action;

    const [permissions, total] = await Promise.all([
      Permission.find(filter).skip(skip).limit(limit).sort({ resource: 1, action: 1 }),
      Permission.countDocuments(filter),
    ]);

    return { permissions, meta: getPaginationMeta(total, page, limit) };
  }

  findById(id) {
    return Permission.findById(id);
  }

  findByName(name) {
    return Permission.findOne({ name });
  }

  findByIds(ids) {
    return Permission.find({ _id: { $in: ids } });
  }

  create(data) {
    return Permission.create(data);
  }

  update(id, data) {
    return Permission.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  delete(id) {
    return Permission.findByIdAndDelete(id);
  }
}

module.exports = new PermissionRepository();
