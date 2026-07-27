import express from 'express';
import { generatePortfolioZip, downloadZip } from '../controllers/generateController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, generatePortfolioZip);
router.get('/download/:filename', downloadZip);

export default router;
