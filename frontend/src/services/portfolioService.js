import API from './api';

export const portfolioService = {
  getMyPortfolio: async () => {
    const response = await API.get('/portfolio/me');
    return response.data;
  },

  updateMyPortfolio: async (data) => {
    const response = await API.put('/portfolio/me', data);
    return response.data;
  },

  getPublicPortfolio: async (username) => {
    const response = await API.get(`/portfolio/${username}`);
    return response.data;
  },

  getUserPublicPortfolio: async (username) => {
    const response = await API.get(`/user/${username}`);
    return response.data;
  },

  publishPortfolio: async (data) => {
    const response = await API.post('/portfolio/publish', data);
    return response.data;
  },

  unpublishPortfolio: async () => {
    const response = await API.post('/portfolio/unpublish');
    return response.data;
  },

  checkUsername: async (username) => {
    const response = await API.get(`/portfolio/check-username/${username}`);
    return response.data;
  },

  // Projects CRUD
  createProject: async (projectData) => {
    const response = await API.post('/projects', projectData);
    return response.data;
  },
  updateProject: async (id, projectData) => {
    const response = await API.put(`/projects/${id}`, projectData);
    return response.data;
  },
  deleteProject: async (id) => {
    const response = await API.delete(`/projects/${id}`);
    return response.data;
  },

  // Skills CRUD
  createSkill: async (skillData) => {
    const response = await API.post('/skills', skillData);
    return response.data;
  },
  updateSkill: async (id, skillData) => {
    const response = await API.put(`/skills/${id}`, skillData);
    return response.data;
  },
  deleteSkill: async (id) => {
    const response = await API.delete(`/skills/${id}`);
    return response.data;
  },

  // Education CRUD
  createEducation: async (eduData) => {
    const response = await API.post('/education', eduData);
    return response.data;
  },
  updateEducation: async (id, eduData) => {
    const response = await API.put(`/education/${id}`, eduData);
    return response.data;
  },
  deleteEducation: async (id) => {
    const response = await API.delete(`/education/${id}`);
    return response.data;
  },

  // Experience CRUD
  createExperience: async (expData) => {
    const response = await API.post('/experience', expData);
    return response.data;
  },
  updateExperience: async (id, expData) => {
    const response = await API.put(`/experience/${id}`, expData);
    return response.data;
  },
  deleteExperience: async (id) => {
    const response = await API.delete(`/experience/${id}`);
    return response.data;
  },

  // Certificates CRUD
  createCertificate: async (certData) => {
    const response = await API.post('/certificates', certData);
    return response.data;
  },
  updateCertificate: async (id, certData) => {
    const response = await API.put(`/certificates/${id}`, certData);
    return response.data;
  },
  deleteCertificate: async (id) => {
    const response = await API.delete(`/certificates/${id}`);
    return response.data;
  },

  // Messages Inbox
  sendMessage: async (msgData) => {
    const response = await API.post('/messages', msgData);
    return response.data;
  },
  getMyMessages: async () => {
    const response = await API.get('/messages/me');
    return response.data;
  },
  markMessageRead: async (id) => {
    const response = await API.put(`/messages/${id}/read`);
    return response.data;
  },

  // Explore Public Portfolios
  explorePortfolios: async (params) => {
    const response = await API.get('/public/explore', { params });
    return response.data;
  },

  // ZIP Generation & Export
  generateZip: async () => {
    const response = await API.post('/generate');
    return response.data;
  },
  downloadZipFile: async (filename) => {
    const response = await API.get(`/generate/download/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
