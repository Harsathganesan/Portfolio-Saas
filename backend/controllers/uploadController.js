import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import fs from 'fs';

// @desc    Upload image or file (PDF)
// @route   POST /api/upload
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    let fileUrl = '';
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    if (isCloudinaryConfigured) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'portfolio_saas',
          resource_type: 'auto',
        });
        fileUrl = result.secure_url;
        // Clean up local temp file
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cloudinaryErr) {
        console.warn('⚠️ Cloudinary upload warning (using local file fallback):', cloudinaryErr.message);
        fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }
    } else {
      // Served via local static folder
      fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
