'use strict';

const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const productRepository = require('./product.repository');
const Category = require('../../models/category.model');
const PageView = require('../../models/pageView.model');
const ApiError = require('../../utils/apiError');
const { UPLOADS_DIR } = require('../../middlewares/upload.middleware');

const buildImageUrl = (req, filename) =>
  `${req.protocol}://${req.get('host')}/uploads/${filename}`;

class ProductService {
  async getProducts(query) {
    const filter = { isActive: true };

    if (query.category) {
      const cat = await Category.findOne({ slug: query.category, isActive: true }).select('_id');
      if (!cat) throw ApiError.notFound('Category not found');
      filter.category = cat._id;
    }

    if (query.featured === 'true') filter.isFeatured = true;

    if (query.search) {
      filter.$text = { $search: query.search };
    }

    return productRepository.findAll({
      filter,
      page: query.page,
      limit: query.limit,
    });
  }

  async getProductBySlug(slug, req) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw ApiError.notFound('Product not found');

    // Fire-and-forget analytics track
    PageView.create({
      pageType: 'product',
      path: req.originalUrl,
      product: product._id,
      category: product.category?._id,
      sessionId: req.headers['x-session-id'] || null,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers.referer || null,
    }).catch(() => {});

    return product;
  }

  async createProduct(data, files, userId, req) {
    const category = await Category.findById(data.categoryId).select('_id');
    if (!category) throw ApiError.badRequest('Invalid category ID');

    const images = (files || []).map((file, index) => ({
      url: buildImageUrl(req, file.filename),
      filename: file.filename,
      isPrimary: index === 0,
    }));

    const payload = {
      name: data.name,
      category: data.categoryId,
      description: data.description,
      shortDescription: data.shortDescription,
      tags: data.tags,
      attributes: data.attributes,
      isFeatured: data.isFeatured,
      images,
      createdBy: userId,
    };

    return productRepository.create(payload);
  }

  async updateProduct(id, data, files, req) {
    const product = await productRepository.findById(id);
    if (!product) throw ApiError.notFound('Product not found');

    if (data.name && data.name !== product.name) {
      const newSlug = slugify(data.name, { lower: true, strict: true });
      const conflict = await productRepository.findBySlugExcludingId(newSlug, id);
      if (conflict) throw ApiError.conflict('Another product with this name already exists');
    }

    if (data.categoryId) {
      const category = await Category.findById(data.categoryId).select('_id');
      if (!category) throw ApiError.badRequest('Invalid category ID');
      data.category = data.categoryId;
    }
    delete data.categoryId;

    // Remove requested images
    let currentImages = [...product.images];
    if (data.removeImages?.length) {
      const toRemove = new Set(data.removeImages);
      currentImages = currentImages.filter((img) => {
        if (toRemove.has(img.filename)) {
          const filePath = path.join(UPLOADS_DIR, img.filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          return false;
        }
        return true;
      });
      delete data.removeImages;
    }

    // Append new uploads
    if (files?.length) {
      const newImages = files.map((file) => ({
        url: buildImageUrl(req, file.filename),
        filename: file.filename,
        isPrimary: false,
      }));
      currentImages = currentImages.concat(newImages);
    }

    // Ensure exactly one isPrimary
    if (currentImages.length > 0 && !currentImages.some((img) => img.isPrimary)) {
      currentImages[0].isPrimary = true;
    }

    data.images = currentImages;
    return productRepository.updateById(id, data);
  }

  async deleteProduct(id) {
    const product = await productRepository.findById(id);
    if (!product) throw ApiError.notFound('Product not found');
    return productRepository.updateById(id, { isActive: false });
  }
}

module.exports = new ProductService();
