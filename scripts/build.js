const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
const apiBackup = path.join(process.cwd(), 'src', 'app', '_api_backup');

// Pre-build: move API routes out (incompatible with output: 'export')
if (fs.existsSync(apiDir)) {
  fs.renameSync(apiDir, apiBackup);
  console.log('Pre-build: moved api/ out of app directory');
}

try {
  execSync('npx next build', { stdio: 'inherit' });
} finally {
  // Always restore API routes, even if build fails
  if (fs.existsSync(apiBackup)) {
    fs.renameSync(apiBackup, apiDir);
    console.log('Post-build: restored api/ directory');
  }
}

// Post-build cleanup: remove paths that shouldn't be in static output
const pathsToRemove = [
  'out/admin',
  'out/summaries',
];

console.log('Running post-build cleanup...');

pathsToRemove.forEach((pathToRemove) => {
  const fullPath = path.join(process.cwd(), pathToRemove);

  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`Removed: ${pathToRemove}`);
  } else {
    console.log(`Not found (skipped): ${pathToRemove}`);
  }
});

console.log('Build complete!');
