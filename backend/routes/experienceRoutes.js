import express from 'express';
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getExperience).post(protect, createExperience);
router.route('/:id').put(protect, updateExperience).delete(protect, deleteExperience);

export default router;
