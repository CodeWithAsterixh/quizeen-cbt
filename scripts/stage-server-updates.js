const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version || '2.1.0';
const updatesDir = path.join(root, 'apps', 'server', 'data', 'updates');

function getSha256(filePath) {
  if (!fs.existsSync(filePath)) return undefined;
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function stageUpdates() {
  fs.mkdirSync(updatesDir, { recursive: true });

  const manifestPath = path.join(updatesDir, 'manifest.json');
  let manifest = {};
  if (fs.existsSync(manifestPath)) {
    try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch {}
  }

  const apps = ['student', 'manager'];
  for (const app of apps) {
    const filename = `Queez-${app.charAt(0).toUpperCase() + app.slice(1)}-v${version}.zip`;
    const targetPath = path.join(updatesDir, filename);

    const potentialSources = [
      path.join(root, '.qzn-releases', `v${version}`, filename),
      path.join(root, 'apps', app, 'release', filename),
    ];

    for (const src of potentialSources) {
      if (fs.existsSync(src) && !fs.existsSync(targetPath)) {
        fs.copyFileSync(src, targetPath);
        console.log(`Copied ${filename} to updates folder`);
        break;
      }
    }

    const exists = fs.existsSync(targetPath);
    manifest[app] = {
      version,
      filename,
      releaseNotes: `Queez ${app.charAt(0).toUpperCase() + app.slice(1)} v${version} update package.`,
      sha256: exists ? getSha256(targetPath) : undefined,
    };
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Server update manifest generated at ${manifestPath} for version ${version}`);
}

stageUpdates();
