import express from 'express';
import { sendMessage, getMyMessages, markAsRead } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/me', protect, getMyMessages);
router.put('/:id/read', protect, markAsRead);

export default router;
