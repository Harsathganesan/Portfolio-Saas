/**
 * Root Entry Point for Render Deployment
 *
 * Render executes this file from the repo root.
 * We use child_process.spawn to run backend/server.js
 * in the correct working directory (backend/).
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.join(__dirname, 'backend');

console.log(`[Render] Starting backend server from: ${backendDir}`);

const server = spawn(process.execPath, ['server.js'], {
  cwd: backendDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    // Ensure dotenv loads correctly from backend dir
    PWD: backendDir,
  },
});

server.on('error', (err) => {
  console.error('[Render] Failed to start server:', err.message);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`[Render] Server process exited with code: ${code}`);
  process.exit(code ?? 0);
});

// Forward signals to child process
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    server.kill(signal);
  });
});
