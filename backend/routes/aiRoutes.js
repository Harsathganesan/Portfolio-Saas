import express from 'express';
import { handleGenerateBio, handleGenerateProjectDesc } from '../controllers/aiController.js';

const router = express.Router();

router.post(['/generate-bio', '/ai/generate-bio'], handleGenerateBio);
router.post(['/generate-project-desc', '/ai/generate-project-desc'], handleGenerateProjectDesc);

export default router;
