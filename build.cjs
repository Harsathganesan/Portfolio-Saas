/**
 * build.cjs — Vercel build script
 * Runs as CommonJS (no ESM issues), handles install + build + copy
 * without relying on shell `cd` or platform-specific commands.
 */
const { execSync } = require('child_process');
const { cpSync, rmSync, existsSync } = require('fs');
const path = require('path');

const ROOT = __dirname;
const FRONTEND = path.join(ROOT, 'frontend');
const FRONTEND_DIST = path.join(FRONTEND, 'dist');
const ROOT_DIST = path.join(ROOT, 'dist');

console.log('📦 Installing frontend dependencies...');
execSync('npm install', { cwd: FRONTEND, stdio: 'inherit' });

console.log('🔨 Building frontend with Vite...');
execSync('npx vite build', { cwd: FRONTEND, stdio: 'inherit' });

console.log('📂 Copying dist to project root...');
if (existsSync(ROOT_DIST)) {
  rmSync(ROOT_DIST, { recursive: true, force: true });
}
cpSync(FRONTEND_DIST, ROOT_DIST, { recursive: true });

console.log('✅ Build complete! Output is at /dist');
