import express from 'express';
import { explorePortfolios } from '../controllers/publicController.js';

const router = express.Router();

router.get('/explore', explorePortfolios);

export default router;
