const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const JSZip = require('jszip');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version || '2.3.0';
const targetDirs = [
  path.join(root, 'apps', 'server', 'data', 'updates'),
  path.join(root, 'data', 'updates'),
  path.join(root, 'apps', 'server', 'release', 'win-unpacked', 'data', 'updates'),
  process.env.PROGRAMDATA ? path.join(process.env.PROGRAMDATA, 'Queez CBT Suite', 'data', 'updates') : '',
].filter(Boolean);

function getSha256(filePath) {
  if (!fs.existsSync(filePath)) return undefined;
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

async function stageUpdates() {
  for (const dir of targetDirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const primaryDir = targetDirs[0];
  const apps = ['student', 'manager'];
  const manifest = {};

  for (const app of apps) {
    const filename = `Queez-${app.charAt(0).toUpperCase() + app.slice(1)}-v${version}.zip`;
    const targetPath = path.join(primaryDir, filename);

    const potentialSources = [
      path.join(root, '.qzn-releases', `v${version}`, filename),
      path.join(root, 'apps', app, 'release', filename),
    ];

    let found = false;
    for (const src of potentialSources) {
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, targetPath);
        console.log(`Copied ${filename} from release folder`);
        found = true;
        break;
      }
    }

    if (!found && !fs.existsSync(targetPath)) {
      const zip = new JSZip();
      zip.file('package.json', JSON.stringify({ name: `queez-${app}`, version }, null, 2));
      zip.file('version.txt', `Queez ${app} v${version}\nBuilt: ${new Date().toISOString()}\n`);
      const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      fs.writeFileSync(targetPath, buffer);
      console.log(`Generated staged update archive: ${filename}`);
    }

    for (const dir of targetDirs.slice(1)) {
      if (fs.existsSync(targetPath)) {
        fs.copyFileSync(targetPath, path.join(dir, filename));
      }
    }

    manifest[app] = {
      version,
      filename,
      releaseNotes: `Queez ${app.charAt(0).toUpperCase() + app.slice(1)} v${version} update package.`,
      sha256: getSha256(targetPath),
    };
  }

  for (const dir of targetDirs) {
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  }

  console.log(`Server update manifest generated for version ${version}`);
}

stageUpdates().catch(console.error);

