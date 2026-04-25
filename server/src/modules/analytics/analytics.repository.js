'use strict';

const PageView = require('../../models/pageView.model');

const THIRTY_DAYS_AGO = () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

class AnalyticsRepository {
  track(data) {
    return PageView.create(data);
  }

  totalViews(filter = {}) {
    return PageView.countDocuments(filter);
  }

  uniqueSessions(filter = {}) {
    return PageView.distinct('sessionId', { ...filter, sessionId: { $ne: null } });
  }

  async viewsByPageType() {
    const result = await PageView.aggregate([
      { $group: { _id: '$pageType', count: { $sum: 1 } } },
    ]);
    return Object.fromEntries(result.map((r) => [r._id, r.count]));
  }

  async dailyViews(filter = {}, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return PageView.aggregate([
      { $match: { ...filter, timestamp: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', count: 1 } },
    ]);
  }

  async categoryViews() {
    return PageView.aggregate([
      { $match: { pageType: 'category', category: { $ne: null } } },
      { $group: { _id: '$category', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          views: 1,
          name: '$categoryInfo.name',
          slug: '$categoryInfo.slug',
        },
      },
    ]);
  }

  async productViews(limit = 20) {
    return PageView.aggregate([
      { $match: { pageType: 'product', product: { $ne: null } } },
      { $group: { _id: '$product', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          views: 1,
          name: '$productInfo.name',
          slug: '$productInfo.slug',
        },
      },
    ]);
  }
}

module.exports = new AnalyticsRepository();
