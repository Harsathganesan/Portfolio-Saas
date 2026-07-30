import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

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

import { getPublicUserPortfolio } from './controllers/portfolioController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST with explicit path fallback
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ─── CORS Configuration ─────────────────────────────────────────────
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.options('*', cors());


// ─── Core Body Middlewares ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));


// ─── Connect Database ───────────────────────────────────────────────
connectDB();
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ─── Root & API Base Endpoints ─────────────────────────────────────
app.get(['/', '/api', '/api/'], (req, res) => {
  res.json({
    status: 'ok',
    success: true,
    message: 'Portfolio SaaS Backend API is running',
    version: '1.0.0',
    time: new Date().toISOString(),
  });
});

app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'Portfolio SaaS Backend API',
    database: 'MongoDB Atlas',
    time: new Date().toISOString(),
  });
});

// ─── REST API Routes ────────────────────────────────────────────────
console.log('📋 Registering API routes...');

const mountApiRoute = (pathSuffix, routeHandler) => {
  app.use(`/api${pathSuffix}`, routeHandler);
  app.use(pathSuffix, routeHandler);
};

mountApiRoute('/auth', authRoutes);
mountApiRoute('/portfolio', portfolioRoutes);
app.get(['/api/user/:username', '/user/:username'], getPublicUserPortfolio);
mountApiRoute('/projects', projectRoutes);
mountApiRoute('/skills', skillRoutes);
mountApiRoute('/education', educationRoutes);
mountApiRoute('/experience', experienceRoutes);
mountApiRoute('/certificates', certificateRoutes);
mountApiRoute('/analytics', analyticsRoutes);
mountApiRoute('/admin', adminRoutes);
mountApiRoute('/ai', aiRoutes);
mountApiRoute('/upload', uploadRoutes);
mountApiRoute('/messages', messageRoutes);
mountApiRoute('/public', publicRoutes);
mountApiRoute('/generate', generateRoutes);

console.log('✅ All API routes registered successfully');

// ─── Error Handling (MUST be AFTER routes) ──────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server (Skip in Vercel Serverless Environment) ──────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5002;

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`✅ All routes ready. Server startup complete.`);

    // Render 5-minute Auto Keep-Alive Ping
    if (process.env.RENDER_EXTERNAL_URL) {
      setInterval(() => {
        const renderUrl = process.env.RENDER_EXTERNAL_URL;
        http.get(`${renderUrl}/api/health`, (res) => {
          console.log(`📡 Render Keep-Alive Ping: ${res.statusCode}`);
        }).on('error', () => {});
      }, 5 * 60 * 1000);
      console.log(`🔁 Render Keep-Alive enabled: ${process.env.RENDER_EXTERNAL_URL}/api/health`);
    }
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${PORT} is already in use. Another server instance may be running.`);
    } else {
      console.error('💥 Server error:', error.message);
    }
  });
}

export default app;

