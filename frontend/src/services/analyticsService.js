import API from './api';

export const analyticsService = {
  getMyAnalytics: async () => {
    const response = await API.get('/analytics');
    return response.data;
  },

  trackEvent: async (username, eventType, projectId = null) => {
    try {
      const response = await API.post('/analytics/track', { username, eventType, projectId });
      return response.data;
    } catch (e) {
      console.warn('Analytics tracking failed silently:', e.message);
    }
  },
};
