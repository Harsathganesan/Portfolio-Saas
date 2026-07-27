import express from 'express';
import { getMyAnalytics, trackEvent } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMyAnalytics);
router.post('/track', trackEvent);

export default router;
