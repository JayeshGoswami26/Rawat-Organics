'use strict';

const roleRepository = require('./role.repository');
const permissionRepository = require('../permissions/permission.repository');
const ApiError = require('../../utils/apiError');

const validatePermissionIds = async (ids) => {
  if (!ids.length) return;
  const found = await permissionRepository.findByIds(ids);
  if (found.length !== ids.length) {
    throw ApiError.badRequest('One or more permission IDs are invalid');
  }
};

class RoleService {
  getAllRoles(query) {
    return roleRepository.findAll(query);
  }

  async getRoleById(id) {
    const role = await roleRepository.findById(id);
    if (!role) throw ApiError.notFound('Role not found');
    return role;
  }

  async createRole(data, createdBy) {
    const existing = await roleRepository.findByName(data.name);
    if (existing) throw ApiError.conflict(`Role '${data.name}' already exists`);

    await validatePermissionIds(data.permissions || []);

    return roleRepository.create({ ...data, createdBy });
  }

  async updateRole(id, data) {
    const role = await roleRepository.findById(id);
    if (!role) throw ApiError.notFound('Role not found');
    if (role.isSystem && data.isActive === false) {
      throw ApiError.forbidden('Cannot deactivate system roles');
    }
    return roleRepository.update(id, data);
  }

  async setRolePermissions(id, permissionIds) {
    const role = await roleRepository.findById(id);
    if (!role) throw ApiError.notFound('Role not found');
    await validatePermissionIds(permissionIds);
    return roleRepository.setPermissions(id, permissionIds);
  }

  async addRolePermissions(id, permissionIds) {
    const role = await roleRepository.findById(id);
    if (!role) throw ApiError.notFound('Role not found');
    await validatePermissionIds(permissionIds);
    return roleRepository.addPermissions(id, permissionIds);
  }

  async removeRolePermissions(id, permissionIds) {
    const role = await roleRepository.findById(id);
    if (!role) throw ApiError.notFound('Role not found');
    return roleRepository.removePermissions(id, permissionIds);
  }

  async deleteRole(id) {
    const role = await roleRepository.findById(id);
    if (!role) throw ApiError.notFound('Role not found');
    if (role.isSystem) throw ApiError.forbidden('Cannot delete system roles');
    await roleRepository.delete(id);
  }
}

module.exports = new RoleService();
