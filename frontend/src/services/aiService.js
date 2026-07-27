import API from './api';

export const aiService = {
  generateBio: async (params) => {
    const response = await API.post('/ai/generate-bio', params);
    return response.data;
  },

  generateProjectDescription: async (params) => {
    const response = await API.post('/ai/generate-project-desc', params);
    return response.data;
  },
};
