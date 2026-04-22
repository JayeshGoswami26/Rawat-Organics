'use strict';

const permissionRepository = require('./permission.repository');
const ApiError = require('../../utils/apiError');

class PermissionService {
  getAllPermissions(query) {
    return permissionRepository.findAll(query);
  }

  async getPermissionById(id) {
    const permission = await permissionRepository.findById(id);
    if (!permission) throw ApiError.notFound('Permission not found');
    return permission;
  }

  async createPermission(data) {
    const name = `${data.resource}:${data.action}`;
    const existing = await permissionRepository.findByName(name);
    if (existing) throw ApiError.conflict(`Permission '${name}' already exists`);
    return permissionRepository.create({ ...data, name });
  }

  async updatePermission(id, data) {
    const permission = await permissionRepository.findById(id);
    if (!permission) throw ApiError.notFound('Permission not found');
    if (permission.isSystem) throw ApiError.forbidden('Cannot modify system permissions');
    return permissionRepository.update(id, data);
  }

  async deletePermission(id) {
    const permission = await permissionRepository.findById(id);
    if (!permission) throw ApiError.notFound('Permission not found');
    if (permission.isSystem) throw ApiError.forbidden('Cannot delete system permissions');
    await permissionRepository.delete(id);
  }
}

module.exports = new PermissionService();
