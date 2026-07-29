import API from './api';

export const uploadService = {
  // Generic upload
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Optimized Image Upload (Cloudinary WebP/Auto compression)
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Resume PDF Upload
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post('/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete file by URL / publicId
  deleteFile: async (fileUrl, publicId) => {
    const response = await API.delete('/upload/file', {
      data: { fileUrl, publicId },
    });
    return response.data;
  },
};
