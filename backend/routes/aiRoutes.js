import express from 'express';
import { handleGenerateBio, handleGenerateProjectDesc } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-bio', protect, handleGenerateBio);
router.post('/generate-project-desc', protect, handleGenerateProjectDesc);

export default router;
