/**
 * uploadService.js
 * Routes all uploads through the backend API which uses Cloudinary server-side.
 * This avoids the need for an unsigned Cloudinary upload preset.
 */
import API from './api';

export const uploadService = {
  /** Upload any image (avatar, project screenshot, certificate, etc.) */
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** Upload image */
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** Upload resume PDF */
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post('/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** Delete file by publicId */
  deleteFile: async (publicId, resourceType = 'image') => {
    const response = await API.delete('/upload/file', {
      data: { publicId, resourceType },
    });
    return response.data;
  },
};
