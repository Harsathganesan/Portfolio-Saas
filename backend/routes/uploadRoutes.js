import express from 'express';
import { uploadImage, uploadResume, uploadFile, deleteFile } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Upload Endpoints
router.post('/image', upload.single('file'), uploadImage);
router.post('/resume', upload.single('file'), uploadResume);
router.post('/', upload.single('file'), uploadFile);

// Delete Endpoints
router.delete('/file', protect, deleteFile);
router.delete('/', protect, deleteFile);

export default router;
