import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import generateRoutes from './routes/generateRoutes.js';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// Connect Database
connectDB();

// Core Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static Uploads Directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Portfolio SaaS Backend API',
    time: new Date().toISOString(),
  });
});

import { getPublicUserPortfolio } from './controllers/portfolioController.js';

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.get('/api/user/:username', getPublicUserPortfolio);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/generate', generateRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
});
