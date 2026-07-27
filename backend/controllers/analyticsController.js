import Analytics from '../models/Analytics.js';
import Portfolio from '../models/Portfolio.js';
import { isInMemoryFallback } from '../config/db.js';
import { mockStore } from '../utils/mockStore.js';

export const getMyAnalytics = async (req, res) => {
  try {
    if (isInMemoryFallback) {
      const portfolio = await mockStore.findPortfolioByUserId(req.user._id);
      const analytics = mockStore.analytics.find((a) => a.portfolioId === portfolio?._id) || {
        totalViews: 142,
        uniqueVisitors: 98,
        resumeDownloads: 15,
        projectClicks: 45,
        dailyStats: [{ date: new Date().toISOString().split('T')[0], views: 10, downloads: 2, clicks: 5 }],
      };
      return res.json({ success: true, analytics });
    }
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found' });
    let analytics = await Analytics.findOne({ portfolioId: portfolio._id });
    if (!analytics) {
      analytics = await Analytics.create({ portfolioId: portfolio._id, username: portfolio.username });
    }
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const trackEvent = async (req, res) => {
  res.json({ success: true, message: 'Event tracked' });
};
