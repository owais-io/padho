const fs = require('fs');
const path = require('path');

// Paths to remove from the build output
const pathsToRemove = [
  'out/admin',
  'out/summaries',
];

console.log('Running post-build cleanup...');

pathsToRemove.forEach((pathToRemove) => {
  const fullPath = path.join(process.cwd(), pathToRemove);

  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`✓ Removed: ${pathToRemove}`);
  } else {
    console.log(`○ Not found (skipped): ${pathToRemove}`);
  }
});

console.log('Post-build cleanup complete!');
