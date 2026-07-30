/**
 * Vercel Serverless Entry Point Adapter
 * Imports and exports the primary Express application from /backend/server.js.
 * This guarantees 100% code identity between Localhost and Vercel Production.
 */
import app from '../backend/server.js';

export default app;
