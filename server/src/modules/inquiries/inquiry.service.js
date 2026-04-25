'use strict';

const inquiryRepository = require('./inquiry.repository');
const ApiError = require('../../utils/apiError');

class InquiryService {
  async createInquiry(data, req) {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      message: data.message,
      inquiryType: data.inquiryType,
      product: data.productId || null,
      category: data.categoryId || null,
      source: data.source || req.get('referer') || null,
      ipAddress: req.ip,
    };
    return inquiryRepository.create(payload);
  }

  async getAllInquiries(query) {
    const filter = {};

    if (query.status) filter.status = query.status;
    if (query.type) filter.inquiryType = query.type;

    return inquiryRepository.findAll({
      filter,
      page: query.page,
      limit: query.limit,
    });
  }

  async getInquiryById(id) {
    const inquiry = await inquiryRepository.findById(id);
    if (!inquiry) throw ApiError.notFound('Inquiry not found');

    // Auto-mark as read when admin opens it
    if (inquiry.status === 'new') {
      await inquiryRepository.updateById(id, { status: 'read' });
      inquiry.status = 'read';
    }

    return inquiry;
  }

  async updateStatus(id, data) {
    const inquiry = await inquiryRepository.findById(id);
    if (!inquiry) throw ApiError.notFound('Inquiry not found');
    return inquiryRepository.updateById(id, data);
  }
}

module.exports = new InquiryService();
