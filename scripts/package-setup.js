const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version || '2.0.2';

function run(cmd, cwd = root) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', env: process.env });
}

function runAsync(cmd, cwd = root) {
  return new Promise((resolve, reject) => {
    console.log(`\n> ${cmd} (parallel)`);
    const [c, ...args] = cmd.split(' ');
    const child = spawn(c, args, { cwd, shell: true, stdio: 'inherit', env: process.env });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed (${code}): ${cmd}`));
    });
  });
}

function findMakeNsis() {
  // Prefer system-installed 64-bit NSIS (avoids 32-bit mmap hang on >1 GB payloads)
  const systemPaths = [
    'C:\\Program Files (x86)\\NSIS\\makensis.exe',
    'C:\\Program Files\\NSIS\\makensis.exe',
  ];
  for (const p of systemPaths) {
    if (fs.existsSync(p)) {
      console.log(`Using system NSIS: ${p}`);
      return p;
    }
  }
  // Try PATH
  try {
    const out = execSync('where.exe makensis', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    if (out) return out.split(/\r?\n/)[0];
  } catch {}
  // Fall back to 32-bit electron-builder cache - will hang on payloads >600 MB
  const cacheDir = path.join(process.env.LOCALAPPDATA || '', 'electron-builder', 'Cache');
  if (fs.existsSync(cacheDir)) {
    for (const entry of fs.readdirSync(cacheDir).filter((e) => e.startsWith('nsis-'))) {
      const nsisDir = path.join(cacheDir, entry);
      for (const s of fs.readdirSync(nsisDir)) {
        for (const p of [path.join(nsisDir, s, 'Bin', 'makensis.exe'), path.join(nsisDir, s, 'makensis.exe')]) {
          if (fs.existsSync(p)) {
            console.warn(`WARNING: Falling back to 32-bit NSIS. This WILL hang on a 1.2 GB payload.`);
            console.warn(`Install 64-bit NSIS from: https://nsis.sourceforge.io/Download`);
            return p;
          }
        }
      }
    }
  }
  throw new Error('makensis.exe not found. Install NSIS from https://nsis.sourceforge.io/Download');
}

async function main() {
  console.log(`=== Packaging Queez CBT Suite v${version} (Current Build) ===`);
  const releaseDir = path.join(root, '.qzn-releases', `v${version}`);
  fs.mkdirSync(releaseDir, { recursive: true });

  console.log('\n--- Packaging Electron Directories (Using Existing Dist) ---');
  await Promise.all([
    runAsync('npx --workspace=apps/server electron-builder --dir'),
    runAsync('npx --workspace=apps/manager electron-builder --dir'),
    runAsync('npx --workspace=apps/student electron-builder --dir'),
  ]);

  console.log('\n--- Compiling Unified Suite Setup ---');
  const makensis = findMakeNsis();
  const outInstaller = path.join(releaseDir, `Queez-CBT-Suite-Setup-v${version}.exe`);
  const nsisCmd = `"${makensis}" /V3 /DVERSION="${version}" /DOUT_FILE="${outInstaller}" ` +
    `/DSERVER_DIR="${path.join(root, 'apps/server/release/win-unpacked')}" ` +
    `/DMANAGER_DIR="${path.join(root, 'apps/manager/release/win-unpacked')}" ` +
    `/DSTUDENT_DIR="${path.join(root, 'apps/student/release/win-unpacked')}" ` +
    `/DICON_PATH="${path.join(root, 'apps/manager/resources/icon.ico')}" ` +
    `/DLICENSE_PATH="${path.join(root, 'installer/LICENSE.txt')}" ` +
    `"${path.join(root, 'installer/suite.nsi')}"`;
  run(nsisCmd);

  const sizeMb = (fs.statSync(outInstaller).size / 1024 / 1024).toFixed(1);
  console.log(`\nInstaller generated successfully: ${outInstaller} (${sizeMb} MB)\n`);
}

main().catch((err) => { console.error('\nPackaging failed:', err.message); process.exit(1); });
