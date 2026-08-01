import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  deleteUserByAdmin,
  toggleFeaturedPortfolio,
  getDbStatus,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/db-status', getDbStatus);
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUserByAdmin);
router.put('/portfolios/:id/feature', toggleFeaturedPortfolio);

export default router;
