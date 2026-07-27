/**
 * Render Entry Point - Root server.js
 * This file exists because Render runs from the repo root.
 * It changes directory to backend and starts server.js from there.
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendPath = path.join(__dirname, 'backend');

console.log('🔁 Render Root Entry: Starting backend from:', backendPath);

const child = spawn('node', ['server.js'], {
  cwd: backendPath,
  stdio: 'inherit',
  env: { ...process.env },
});

child.on('error', (err) => {
  console.error('❌ Failed to start backend server:', err.message);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Backend process exited with code ${code}`);
  process.exit(code ?? 0);
});
