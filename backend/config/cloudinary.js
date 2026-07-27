import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

let isCloudinaryConfigured = false;

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  isCloudinaryConfigured = true;
  console.log('✅ Cloudinary storage initialized');
} else {
  console.log('ℹ️ Cloudinary credentials not detected, using local disk storage fallback');
}

export { cloudinary, isCloudinaryConfigured };
