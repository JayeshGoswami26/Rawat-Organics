'use strict';

const User = require('../../models/user.model');
const { getPagination, getPaginationMeta } = require('../../utils/pagination.util');

class UserRepository {
  async findAll(query = {}) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
    if (query.search) {
      filter.$or = [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .populate('roles', 'name displayName isActive')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    return { users, meta: getPaginationMeta(total, page, limit) };
  }

  findById(id) {
    return User.findById(id).populate({
      path: 'roles',
      select: 'name displayName permissions isActive',
      populate: { path: 'permissions', select: 'name resource action' },
    });
  }

  update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate(
      'roles',
      'name displayName'
    );
  }

  setRoles(id, roleIds) {
    return User.findByIdAndUpdate(id, { roles: roleIds }, { new: true }).populate(
      'roles',
      'name displayName'
    );
  }

  delete(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();
