import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

// Resolve paths relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars from backend/.env for local development
// In Vercel production, env vars are set via Vercel Dashboard
dotenv.config({ path: resolve(__dirname, '../backend/.env') });

import app from '../backend/server.js';

// Vercel Serverless Function Handler
// Express app is a valid request handler (req, res) => void
export default app;
