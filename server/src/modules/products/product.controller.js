'use strict';

const productService = require('./product.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');

class ProductController {
  getAll = asyncHandler(async (req, res) => {
    const { items, meta } = await productService.getProducts(req.query);
    ApiResponse.success(res, 'Products retrieved', { products: items }, meta);
  });

  getBySlug = asyncHandler(async (req, res) => {
    const product = await productService.getProductBySlug(req.params.slug, req);
    ApiResponse.success(res, 'Product retrieved', { product });
  });

  create = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(
      req.body,
      req.files,
      req.user._id,
      req
    );
    ApiResponse.created(res, 'Product created', { product });
  });

  update = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(
      req.params.id,
      req.body,
      req.files,
      req
    );
    ApiResponse.success(res, 'Product updated', { product });
  });

  remove = asyncHandler(async (req, res) => {
    await productService.deleteProduct(req.params.id);
    ApiResponse.success(res, 'Product deactivated');
  });
}

module.exports = new ProductController();
