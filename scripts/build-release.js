const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { promptVersion } = require('./bump-version.js');

const root = path.resolve(__dirname, '..');

function run(cmd, cwd = root) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', env: process.env });
}

function runAsync(cmd, cwd = root) {
  return new Promise((resolve, reject) => {
    console.log(`\n> ${cmd} (started in parallel)`);
    const [c, ...args] = cmd.split(' ');
    const child = spawn(c, args, { cwd, shell: true, stdio: 'inherit', env: process.env });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed (${code}): ${cmd}`));
    });
  });
}

function findMakeNsis() {
  // Prefer system-installed 64-bit NSIS (avoids 32-bit mmap limit on large installers)
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
  // Fall back to 32-bit electron-builder cache (may hang on >1 GB payloads)
  const cacheDir = path.join(process.env.LOCALAPPDATA || '', 'electron-builder', 'Cache');
  if (fs.existsSync(cacheDir)) {
    for (const entry of fs.readdirSync(cacheDir).filter(e => e.startsWith('nsis-'))) {
      const nsisDir = path.join(cacheDir, entry);
      for (const s of fs.readdirSync(nsisDir)) {
        for (const p of [path.join(nsisDir, s, 'Bin', 'makensis.exe'), path.join(nsisDir, s, 'makensis.exe')]) {
          if (fs.existsSync(p)) {
            console.warn(`WARNING: Using 32-bit NSIS from electron-builder cache. Install NSIS from https://nsis.sourceforge.io for large installers.`);
            return p;
          }
        }
      }
    }
  }
  throw new Error('makensis.exe not found. Install NSIS from https://nsis.sourceforge.io/Download');
}

async function main() {
  console.log('=== Queez CBT Unified Suite Release Builder ===');
  const version = await promptVersion();
  const releaseDir = path.join(root, '.qzn-releases', `v${version}`);
  fs.mkdirSync(releaseDir, { recursive: true });

  console.log('\n--- Step 1: Generating Icons ---');
  run('node scripts/generate-icons.js');

  console.log('\n--- Step 2: Packaging Server, Manager, and Student in Parallel ---');
  await Promise.all([
    runAsync('npm --workspace=apps/server run electron:pack'),
    runAsync('npm --workspace=apps/manager run electron:pack'),
    runAsync('npm --workspace=apps/student run electron:pack'),
  ]);

  console.log('\n--- Step 3: Compiling Unified Suite Installer ---');
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

  ['apps/server/release', 'apps/manager/release', 'apps/student/release'].forEach(dir => {
    fs.rmSync(path.join(root, dir), { recursive: true, force: true });
  });

  const sizeMb = (fs.statSync(outInstaller).size / 1024 / 1024).toFixed(1);
  const manifest = { productName: 'Queez CBT Suite', version, releaseDate: new Date().toISOString(), installer: path.basename(outInstaller), sizeMb, components: ['Queez Local Server', 'Queez Assessment Manager', 'Queez Student Portal'] };
  fs.writeFileSync(path.join(releaseDir, 'release-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`\nQueez CBT Suite v${version} built successfully!\nInstaller: ${outInstaller} (${sizeMb} MB)\n`);
}

main().catch((err) => { console.error('\nRelease build failed:', err.message); process.exit(1); });
