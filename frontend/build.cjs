/**
 * build.cjs — runs from the frontend/ directory (Vercel's root)
 * Uses CommonJS so require() works without ESM issues.
 */
const { execSync } = require('child_process');

console.log('🔨 Building frontend with Vite...');
execSync('npx vite build', { cwd: __dirname, stdio: 'inherit' });
console.log('✅ Build complete! Output is at dist/');
