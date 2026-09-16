const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dirs = [
  'apps/server/release',
  'apps/manager/release',
  'apps/student/release',
  'apps/server/dist',
  'apps/manager/dist',
  'apps/student/dist',
];

console.log('Cleaning local workspace build artifacts...');
let freedBytes = 0;

function getDirSize(dirPath) {
  let total = 0;
  if (!fs.existsSync(dirPath)) return 0;
  try {
    const files = fs.readdirSync(dirPath);
    for (const f of files) {
      const full = path.join(dirPath, f);
      const st = fs.statSync(full);
      total += st.isDirectory() ? getDirSize(full) : st.size;
    }
  } catch {}
  return total;
}

dirs.forEach((rel) => {
  const full = path.join(root, rel);
  if (fs.existsSync(full)) {
    const sz = getDirSize(full);
    freedBytes += sz;
    fs.rmSync(full, { recursive: true, force: true });
    console.log(`Removed ${rel} (${(sz / 1024 / 1024).toFixed(1)} MB)`);
  }
});

console.log(`Done! Total workspace storage freed: ${(freedBytes / 1024 / 1024).toFixed(1)} MB`);
