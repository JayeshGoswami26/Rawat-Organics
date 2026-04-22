'use strict';

const userRepository = require('./user.repository');
const roleRepository = require('../roles/role.repository');
const ApiError = require('../../utils/apiError');

class UserService {
  getAllUsers(query) {
    return userRepository.findAll(query);
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async updateUser(id, data) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return userRepository.update(id, data);
  }

  async setUserRoles(id, roleIds) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');

    const roles = await Promise.all(roleIds.map((rid) => roleRepository.findById(rid)));
    if (roles.some((r) => !r)) throw ApiError.badRequest('One or more role IDs are invalid');

    return userRepository.setRoles(id, roleIds);
  }

  async toggleStatus(id, isActive, requesterId) {
    if (id === requesterId.toString()) {
      throw ApiError.badRequest('Cannot modify your own active status');
    }
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return userRepository.update(id, { isActive });
  }

  async deleteUser(id, requesterId) {
    if (id === requesterId.toString()) {
      throw ApiError.badRequest('Cannot delete your own account');
    }
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    await userRepository.delete(id);
  }
}

module.exports = new UserService();
