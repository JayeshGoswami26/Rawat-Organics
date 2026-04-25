'use strict';

const analyticsService = require('./analytics.service');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');

class AnalyticsController {
  track = asyncHandler(async (req, res) => {
    await analyticsService.track(req.body, req);
    ApiResponse.created(res, 'Event tracked');
  });

  overview = asyncHandler(async (req, res) => {
    const data = await analyticsService.getOverview();
    ApiResponse.success(res, 'Overview retrieved', data);
  });

  landingPage = asyncHandler(async (req, res) => {
    const data = await analyticsService.getLandingPageInsights();
    ApiResponse.success(res, 'Landing page insights retrieved', { dailyViews: data });
  });

  categories = asyncHandler(async (req, res) => {
    const data = await analyticsService.getCategoryViews();
    ApiResponse.success(res, 'Category analytics retrieved', { categoryViews: data });
  });

  products = asyncHandler(async (req, res) => {
    const data = await analyticsService.getProductViews(req.query);
    ApiResponse.success(res, 'Product analytics retrieved', { productViews: data });
  });
}

module.exports = new AnalyticsController();
