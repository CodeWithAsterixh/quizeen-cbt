const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findMakeNsis() {
  const systemPaths = [
    'C:\\Program Files (x86)\\NSIS\\makensis.exe',
    'C:\\Program Files\\NSIS\\makensis.exe',
  ];
  for (const p of systemPaths) {
    if (fs.existsSync(p)) return p;
  }
  try {
    const out = execSync('where.exe makensis', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    if (out) return out.split(/\r?\n/)[0];
  } catch {}

  const cacheDir = path.join(process.env.LOCALAPPDATA || '', 'electron-builder', 'Cache');
  if (fs.existsSync(cacheDir)) {
    for (const entry of fs.readdirSync(cacheDir).filter(e => e.startsWith('nsis-'))) {
      const nsisDir = path.join(cacheDir, entry);
      for (const s of fs.readdirSync(nsisDir)) {
        for (const p of [path.join(nsisDir, s, 'Bin', 'makensis.exe'), path.join(nsisDir, s, 'makensis.exe')]) {
          if (fs.existsSync(p)) return p;
        }
      }
    }
  }
  throw new Error('makensis.exe not found. Install NSIS from https://nsis.sourceforge.io/Download');
}

module.exports = { findMakeNsis };
