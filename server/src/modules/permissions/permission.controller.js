'use strict';

const permissionService = require('./permission.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');

class PermissionController {
  getAll = asyncHandler(async (req, res) => {
    const { permissions, meta } = await permissionService.getAllPermissions(req.query);
    ApiResponse.success(res, 'Permissions retrieved', permissions, meta);
  });

  getById = asyncHandler(async (req, res) => {
    const permission = await permissionService.getPermissionById(req.params.id);
    ApiResponse.success(res, 'Permission retrieved', { permission });
  });

  create = asyncHandler(async (req, res) => {
    const permission = await permissionService.createPermission(req.body);
    ApiResponse.created(res, 'Permission created', { permission });
  });

  update = asyncHandler(async (req, res) => {
    const permission = await permissionService.updatePermission(req.params.id, req.body);
    ApiResponse.success(res, 'Permission updated', { permission });
  });

  delete = asyncHandler(async (req, res) => {
    await permissionService.deletePermission(req.params.id);
    ApiResponse.noContent(res);
  });
}

module.exports = new PermissionController();
