'use strict';

const categoryService = require('./category.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');

class CategoryController {
  getAll = asyncHandler(async (req, res) => {
    const includeInactive = req.query.includeInactive === 'true';
    const categories = await categoryService.getAllCategories(includeInactive);
    ApiResponse.success(res, 'Categories retrieved', { categories });
  });

  getBySlug = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    ApiResponse.success(res, 'Category retrieved', { category });
  });

  create = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(
      req.body,
      req.file,
      req.user._id,
      req
    );
    ApiResponse.created(res, 'Category created', { category });
  });

  update = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body,
      req.file,
      req
    );
    ApiResponse.success(res, 'Category updated', { category });
  });

  remove = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    ApiResponse.success(res, 'Category deactivated');
  });
}

module.exports = new CategoryController();
