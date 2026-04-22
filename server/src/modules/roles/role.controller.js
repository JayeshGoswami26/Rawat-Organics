'use strict';

const roleService = require('./role.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');

class RoleController {
  getAll = asyncHandler(async (req, res) => {
    const { roles, meta } = await roleService.getAllRoles(req.query);
    ApiResponse.success(res, 'Roles retrieved', roles, meta);
  });

  getById = asyncHandler(async (req, res) => {
    const role = await roleService.getRoleById(req.params.id);
    ApiResponse.success(res, 'Role retrieved', { role });
  });

  create = asyncHandler(async (req, res) => {
    const role = await roleService.createRole(req.body, req.user._id);
    ApiResponse.created(res, 'Role created', { role });
  });

  update = asyncHandler(async (req, res) => {
    const role = await roleService.updateRole(req.params.id, req.body);
    ApiResponse.success(res, 'Role updated', { role });
  });

  setPermissions = asyncHandler(async (req, res) => {
    const role = await roleService.setRolePermissions(req.params.id, req.body.permissions);
    ApiResponse.success(res, 'Role permissions replaced', { role });
  });

  addPermissions = asyncHandler(async (req, res) => {
    const role = await roleService.addRolePermissions(req.params.id, req.body.permissions);
    ApiResponse.success(res, 'Permissions added to role', { role });
  });

  removePermissions = asyncHandler(async (req, res) => {
    const role = await roleService.removeRolePermissions(req.params.id, req.body.permissions);
    ApiResponse.success(res, 'Permissions removed from role', { role });
  });

  delete = asyncHandler(async (req, res) => {
    await roleService.deleteRole(req.params.id);
    ApiResponse.noContent(res);
  });
}

module.exports = new RoleController();
