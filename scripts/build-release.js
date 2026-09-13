const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promptVersion } = require('./bump-version.js');

const root = path.resolve(__dirname, '..');

function run(cmd, cwd = root) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', env: process.env });
}

function findMakeNsis() {
  try {
    const out = execSync('where.exe makensis', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    if (out) return out.split(/\r?\n/)[0];
  } catch {}

  const localAppData = process.env.LOCALAPPDATA;
  if (localAppData) {
    const cacheDir = path.join(localAppData, 'electron-builder', 'Cache');
    if (fs.existsSync(cacheDir)) {
      const entries = fs.readdirSync(cacheDir);
      for (const entry of entries) {
        if (entry.startsWith('nsis-')) {
          const nsisDir = path.join(cacheDir, entry);
          const sub = fs.readdirSync(nsisDir);
          for (const s of sub) {
            const candidate = path.join(nsisDir, s, 'Bin', 'makensis.exe');
            if (fs.existsSync(candidate)) return candidate;
            const candidate2 = path.join(nsisDir, s, 'makensis.exe');
            if (fs.existsSync(candidate2)) return candidate2;
          }
        }
      }
    }
  }
  throw new Error('makensis.exe not found. Please ensure NSIS is installed.');
}

async function main() {
  console.log('=== Queez CBT Unified Suite Release Builder ===');
  const version = await promptVersion();
  const releaseDir = path.join(root, '.qzn-releases', `v${version}`);
  fs.mkdirSync(releaseDir, { recursive: true });

  console.log('\n--- Step 1: Generating Application Icons ---');
  run('node scripts/generate-icons.js', root);

  console.log('\n--- Step 2: Packaging Server App (Unpacked) ---');
  run('npm --workspace=apps/server run electron:pack', root);

  console.log('\n--- Step 3: Packaging Manager App (Unpacked) ---');
  run('npm --workspace=apps/manager run electron:pack', root);

  console.log('\n--- Step 4: Packaging Student App (Unpacked) ---');
  run('npm --workspace=apps/student run electron:pack', root);

  console.log('\n--- Step 5: Compiling Unified Suite Installer ---');
  const makensis = findMakeNsis();
  const outInstaller = path.join(releaseDir, `Queez-CBT-Suite-Setup-v${version}.exe`);
  const serverDir = path.join(root, 'apps', 'server', 'release', 'win-unpacked');
  const managerDir = path.join(root, 'apps', 'manager', 'release', 'win-unpacked');
  const studentDir = path.join(root, 'apps', 'student', 'release', 'win-unpacked');
  const iconPath = path.join(root, 'apps', 'manager', 'resources', 'icon.ico');
  const licensePath = path.join(root, 'installer', 'LICENSE.txt');
  const nsiScript = path.join(root, 'installer', 'suite.nsi');

  const nsisCmd = `"${makensis}" /DVERSION="${version}" /DOUT_FILE="${outInstaller}" /DSERVER_DIR="${serverDir}" /DMANAGER_DIR="${managerDir}" /DSTUDENT_DIR="${studentDir}" /DICON_PATH="${iconPath}" /DLICENSE_PATH="${licensePath}" "${nsiScript}"`;
  run(nsisCmd, root);

  console.log('\n--- Step 6: Cleaning Staging Files ---');
  fs.rmSync(path.join(root, 'apps', 'server', 'release'), { recursive: true, force: true });
  fs.rmSync(path.join(root, 'apps', 'manager', 'release'), { recursive: true, force: true });
  fs.rmSync(path.join(root, 'apps', 'student', 'release'), { recursive: true, force: true });

  const manifest = {
    productName: 'Queez CBT Suite',
    version,
    releaseDate: new Date().toISOString(),
    installer: `Queez-CBT-Suite-Setup-v${version}.exe`,
    sizeMb: (fs.statSync(outInstaller).size / 1024 / 1024).toFixed(1),
    components: [
      'Queez Local Server',
      'Queez Assessment Manager',
      'Queez Student Portal',
    ],
  };
  fs.writeFileSync(path.join(releaseDir, 'release-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`\n======================================================`);
  console.log(`Queez CBT Suite v${version} built successfully!`);
  console.log(`Installer: ${outInstaller} (${manifest.sizeMb} MB)`);
  console.log(`======================================================\n`);
}

main().catch((err) => {
  console.error('\nRelease build failed:', err.message);
  process.exit(1);
});
