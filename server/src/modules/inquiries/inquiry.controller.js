'use strict';

const inquiryService = require('./inquiry.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');

class InquiryController {
  create = asyncHandler(async (req, res) => {
    const inquiry = await inquiryService.createInquiry(req.body, req);
    ApiResponse.created(res, 'Inquiry submitted successfully', { inquiry });
  });

  getAll = asyncHandler(async (req, res) => {
    const { items, meta } = await inquiryService.getAllInquiries(req.query);
    ApiResponse.success(res, 'Inquiries retrieved', { inquiries: items }, meta);
  });

  getById = asyncHandler(async (req, res) => {
    const inquiry = await inquiryService.getInquiryById(req.params.id);
    ApiResponse.success(res, 'Inquiry retrieved', { inquiry });
  });

  updateStatus = asyncHandler(async (req, res) => {
    const inquiry = await inquiryService.updateStatus(req.params.id, req.body);
    ApiResponse.success(res, 'Inquiry status updated', { inquiry });
  });
}

module.exports = new InquiryController();
