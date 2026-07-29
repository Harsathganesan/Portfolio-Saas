import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import fs from 'fs';

// Helper to extract Cloudinary public_id from secure URL
export const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  if (!url.includes('cloudinary.com')) return null;

  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    let path = parts[1];
    // Remove version prefix if exists (e.g., v12345678/)
    path = path.replace(/^v\d+\//, '');
    // Remove extension (e.g., .jpg, .png, .pdf)
    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      path = path.substring(0, lastDotIndex);
    }
    return path;
  } catch (err) {
    return null;
  }
};

// @desc    Upload Image (Profile, Projects, Certificates)
// @route   POST /api/upload/image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    let fileUrl = '';
    let publicId = '';

    if (isCloudinaryConfigured) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'portfolio_saas/images',
          resource_type: 'image',
          transformation: [
            { width: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        });
        fileUrl = result.secure_url;
        publicId = result.public_id;

        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cloudinaryErr) {
        console.warn('⚠️ Cloudinary image upload fallback:', cloudinaryErr.message);
        const fileData = fs.readFileSync(req.file.path);
        const mimeType = req.file.mimetype || 'image/png';
        fileUrl = `data:${mimeType};base64,${fileData.toString('base64')}`;
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      }
    } else {
      const fileData = fs.readFileSync(req.file.path);
      const mimeType = req.file.mimetype || 'image/png';
      fileUrl = `data:${mimeType};base64,${fileData.toString('base64')}`;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    return res.json({
      success: true,
      url: fileUrl,
      publicId,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload Resume PDF
// @route   POST /api/upload/resume
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF resume file uploaded' });
    }

    let fileUrl = '';
    let publicId = '';

    if (isCloudinaryConfigured) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'portfolio_saas/resumes',
          resource_type: 'raw',
          format: 'pdf',
        });
        fileUrl = result.secure_url;
        publicId = result.public_id;

        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cloudinaryErr) {
        console.warn('⚠️ Cloudinary resume upload fallback:', cloudinaryErr.message);
        const fileData = fs.readFileSync(req.file.path);
        fileUrl = `data:application/pdf;base64,${fileData.toString('base64')}`;
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      }
    } else {
      const fileData = fs.readFileSync(req.file.path);
      fileUrl = `data:application/pdf;base64,${fileData.toString('base64')}`;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    return res.json({
      success: true,
      url: fileUrl,
      publicId,
      message: 'Resume PDF uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unified Upload (Image or PDF)
// @route   POST /api/upload
export const uploadFile = async (req, res) => {
  if (req.file && req.file.mimetype === 'application/pdf') {
    return uploadResume(req, res);
  }
  return uploadImage(req, res);
};

// @desc    Delete File from Cloudinary
// @route   DELETE /api/upload/file
export const deleteFile = async (req, res) => {
  try {
    const { fileUrl, publicId } = req.body;
    const targetPublicId = publicId || getPublicIdFromUrl(fileUrl);

    if (!targetPublicId) {
      return res.status(400).json({ success: false, message: 'Invalid or missing Cloudinary file reference' });
    }

    if (isCloudinaryConfigured) {
      await cloudinary.uploader.destroy(targetPublicId);
    }

    res.json({ success: true, message: 'File deleted from Cloudinary successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
