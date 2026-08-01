import API from './api';

export const adminService = {
  getDbStatus: async () => {
    const response = await API.get('/admin/db-status');
    return response.data;
  },
  getStats: async () => {
    const response = await API.get('/admin/stats');
    return response.data;
  },
  getUsers: async () => {
    const response = await API.get('/admin/users');
    return response.data;
  },
  toggleUserStatus: async (userId) => {
    const response = await API.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },
  deleteUser: async (userId) => {
    const response = await API.delete(`/admin/users/${userId}`);
    return response.data;
  },
  toggleFeaturePortfolio: async (portfolioId) => {
    const response = await API.put(`/admin/portfolios/${portfolioId}/feature`);
    return response.data;
  },
};
