'use strict';

const userService = require('./user.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');

class UserController {
  getAll = asyncHandler(async (req, res) => {
    const { users, meta } = await userService.getAllUsers(req.query);
    ApiResponse.success(res, 'Users retrieved', users, meta);
  });

  getById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    ApiResponse.success(res, 'User retrieved', { user });
  });

  update = asyncHandler(async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    ApiResponse.success(res, 'User updated', { user });
  });

  setRoles = asyncHandler(async (req, res) => {
    const user = await userService.setUserRoles(req.params.id, req.body.roles);
    ApiResponse.success(res, 'User roles updated', { user });
  });

  toggleStatus = asyncHandler(async (req, res) => {
    const user = await userService.toggleStatus(req.params.id, req.body.isActive, req.user._id);
    const label = req.body.isActive ? 'activated' : 'deactivated';
    ApiResponse.success(res, `User ${label}`, { user });
  });

  delete = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id, req.user._id);
    ApiResponse.noContent(res);
  });
}

module.exports = new UserController();
