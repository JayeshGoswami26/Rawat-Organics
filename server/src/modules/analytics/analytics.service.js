'use strict';

const analyticsRepository = require('./analytics.repository');

class AnalyticsService {
  async track(data, req) {
    const payload = {
      pageType: data.pageType,
      path: data.path,
      product: data.productId || null,
      category: data.categoryId || null,
      sessionId: data.sessionId || req.headers['x-session-id'] || null,
      referrer: data.referrer || req.headers.referer || null,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };
    return analyticsRepository.track(payload);
  }

  async getOverview() {
    const [totalViews, uniqueSessionIds, viewsByPageType, recentDailyViews] = await Promise.all([
      analyticsRepository.totalViews(),
      analyticsRepository.uniqueSessions(),
      analyticsRepository.viewsByPageType(),
      analyticsRepository.dailyViews({}, 30),
    ]);

    const last30DaysViews = await analyticsRepository.totalViews({
      timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    return {
      totalViews,
      uniqueSessions: uniqueSessionIds.length,
      last30DaysViews,
      viewsByPageType,
      recentDailyViews,
    };
  }

  getLandingPageInsights() {
    return analyticsRepository.dailyViews({ pageType: 'landing' }, 30);
  }

  getCategoryViews() {
    return analyticsRepository.categoryViews();
  }

  getProductViews(query) {
    const limit = Math.min(100, parseInt(query.limit, 10) || 20);
    return analyticsRepository.productViews(limit);
  }
}

module.exports = new AnalyticsService();
