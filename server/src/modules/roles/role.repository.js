'use strict';

const Role = require('../../models/role.model');
const { getPagination, getPaginationMeta } = require('../../utils/pagination.util');

const PERM_POPULATE = 'name resource action description';

class RoleRepository {
  async findAll(query = {}) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};
    if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';

    const [roles, total] = await Promise.all([
      Role.find(filter)
        .populate('permissions', PERM_POPULATE)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Role.countDocuments(filter),
    ]);

    return { roles, meta: getPaginationMeta(total, page, limit) };
  }

  findById(id) {
    return Role.findById(id).populate('permissions', PERM_POPULATE);
  }

  findByName(name) {
    return Role.findOne({ name });
  }

  create(data) {
    return Role.create(data);
  }

  update(id, data) {
    return Role.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
      'permissions',
      PERM_POPULATE
    );
  }

  setPermissions(id, permissionIds) {
    return Role.findByIdAndUpdate(id, { permissions: permissionIds }, { new: true }).populate(
      'permissions',
      PERM_POPULATE
    );
  }

  addPermissions(id, permissionIds) {
    return Role.findByIdAndUpdate(
      id,
      { $addToSet: { permissions: { $each: permissionIds } } },
      { new: true }
    ).populate('permissions', PERM_POPULATE);
  }

  removePermissions(id, permissionIds) {
    return Role.findByIdAndUpdate(
      id,
      { $pull: { permissions: { $in: permissionIds } } },
      { new: true }
    ).populate('permissions', PERM_POPULATE);
  }

  delete(id) {
    return Role.findByIdAndDelete(id);
  }
}

module.exports = new RoleRepository();
