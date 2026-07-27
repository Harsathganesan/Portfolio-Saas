import express from 'express';
import {
  getMyPortfolio,
  updateMyPortfolio,
  getPublicPortfolio,
  deletePortfolio,
  publishPortfolio,
  unpublishPortfolio,
  checkUsernameAvailability,
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/me').get(protect, getMyPortfolio).put(protect, updateMyPortfolio);
router.post('/publish', protect, publishPortfolio);
router.post('/unpublish', protect, unpublishPortfolio);
router.get('/check-username/:username', protect, checkUsernameAvailability);
router.route('/:username').get(getPublicPortfolio);
router.route('/:id').delete(protect, deletePortfolio);

export default router;
