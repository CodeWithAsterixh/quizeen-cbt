const fs = require('fs');
const path = require('path');

const ICON_TARGETS = [
  'apps/server/resources/icon.ico',
  'apps/server/resources/icon.png',
  'apps/server/public/icon.png',
  'apps/manager/resources/icon.ico',
  'apps/manager/resources/icon.png',
  'apps/manager/public/icon.png',
  'apps/student/resources/icon.ico',
  'apps/student/resources/icon.png',
  'apps/student/public/icon.png',
];

function backupOriginalIcons(root) {
  const backupDir = path.join(root, '.qzn-releases', '.icon-backup');
  fs.mkdirSync(backupDir, { recursive: true });
  for (const rel of ICON_TARGETS) {
    const src = path.join(root, rel);
    if (fs.existsSync(src)) {
      const dest = path.join(backupDir, rel.replace(/[\/\\]/g, '___'));
      fs.copyFileSync(src, dest);
    }
  }
}

function restoreOriginalIcons(root) {
  const backupDir = path.join(root, '.qzn-releases', '.icon-backup');
  if (fs.existsSync(backupDir)) {
    for (const rel of ICON_TARGETS) {
      const backupFile = path.join(backupDir, rel.replace(/[\/\\]/g, '___'));
      if (fs.existsSync(backupFile)) {
        const dest = path.join(root, rel);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(backupFile, dest);
      }
    }
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
}

function cleanupWhitelabelBuild(root, releaseDir, tempLogoPath) {
  restoreOriginalIcons(root);

  const installerRes = path.join(root, 'installer', 'resources');
  if (fs.existsSync(installerRes)) {
    fs.rmSync(installerRes, { recursive: true, force: true });
  }
  const defsFile = path.join(root, 'installer', 'whitelabel-defs.nsh');
  if (fs.existsSync(defsFile)) {
    try { fs.unlinkSync(defsFile); } catch {}
  }

  ['apps/server/release', 'apps/manager/release', 'apps/student/release'].forEach((dir) => {
    const p = path.join(root, dir);
    if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
  });

  if (tempLogoPath && fs.existsSync(tempLogoPath)) {
    try { fs.unlinkSync(tempLogoPath); } catch {}
  }

  const qznDir = path.join(root, '.qzn-releases');
  if (fs.existsSync(qznDir)) {
    try {
      const entries = fs.readdirSync(qznDir);
      for (const entry of entries) {
        if (entry.startsWith('temp-logo-') || entry.startsWith('build-job-')) {
          fs.rmSync(path.join(qznDir, entry), { recursive: true, force: true });
        }
      }
    } catch {}
  }

  if (releaseDir && fs.existsSync(releaseDir)) {
    try {
      const files = fs.readdirSync(releaseDir);
      for (const file of files) {
        if (!file.toLowerCase().endsWith('.exe')) {
          fs.rmSync(path.join(releaseDir, file), { recursive: true, force: true });
        }
      }
    } catch {}
  }
}

module.exports = {
  backupOriginalIcons,
  restoreOriginalIcons,
  cleanupWhitelabelBuild,
};
