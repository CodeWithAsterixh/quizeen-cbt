const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { runNsisWithProgress } = require('./run-nsis.js');
const { findMakeNsis } = require('./find-makensis.js');
const { bakeWhitelabel, clearBakedWhitelabel } = require('./whitelabel-writer.js');

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

function parseArgs() {
  const args = process.argv.slice(2);
  const getArg = (prefix, fallback = '') => {
    const item = args.find((a) => a.startsWith(`--${prefix}=`));
    return item ? item.split('=')[1].replace(/^"|"$/g, '') : fallback;
  };

  const configPath = getArg('config');
  let base = {};
  if (configPath && fs.existsSync(configPath)) {
    base = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  const school = getArg('school', base.schoolName || 'Custom Academy');
  const name = getArg('name', base.suiteName || `${school} CBT Suite`);
  const short = getArg('short', base.shortName || school.split(' ')[0]);
  const primary = getArg('primary', base.primaryColor || '#1e40af');
  const accent = getArg('accent', base.accentColor || '#f59e0b');
  const version = getArg('version', base.version || '2.0.0');
  const icon = getArg('icon', base.iconPath || '');
  const noLicense = args.includes('--no-license') || base.unlicensedMode !== false;
  const isDryRun = args.includes('--dry-run');

  return {
    isWhitelabel: true,
    unlicensedMode: noLicense,
    schoolName: school,
    shortName: short,
    suiteName: name,
    brandingText: school,
    studentName: base.studentName || `${school} Student Portal`,
    managerName: base.managerName || `${school} Assessment Manager`,
    serverName: base.serverName || `${school} Local Server`,
    primaryColor: primary,
    accentColor: accent,
    iconPath: icon && fs.existsSync(icon) ? icon : undefined,
    version,
    isDryRun,
  };
}

async function main() {
  const config = parseArgs();
  console.log('=== Whitelabel Release Builder ===');
  console.log(`Target Suite: ${config.suiteName}`);
  console.log(`Institution: ${config.schoolName}`);
  console.log(`License Mode: ${config.unlicensedMode ? 'License-Free Perpetual' : 'Key Activated'}`);
  console.log(`Version: ${config.version}`);

  const releaseDir = path.join(root, '.qzn-releases', `v${config.version}-${config.shortName.toLowerCase()}`);
  fs.mkdirSync(releaseDir, { recursive: true });

  try {
    bakeWhitelabel(config);

    if (config.isDryRun) {
      console.log('\n[Dry Run] Configuration baked successfully. Skipping packaging and NSIS.');
      fs.writeFileSync(path.join(releaseDir, 'dry-run-manifest.json'), JSON.stringify(config, null, 2), 'utf8');
      return;
    }

    console.log('\n--- Step 1: Generating Icons ---');
    run('node scripts/generate-icons.js');

    console.log('\n--- Step 2: Packaging Applications in Parallel ---');
    await Promise.all([
      runAsync('npm --workspace=apps/server run electron:pack'),
      runAsync('npm --workspace=apps/manager run electron:pack'),
      runAsync('npm --workspace=apps/student run electron:pack'),
    ]);

    console.log('\n--- Step 2.5: Staging Updates for Central Server ---');
    run('node scripts/stage-server-updates.js');

    console.log('\n--- Step 3: Compiling Unified Suite Installer ---');
    const makensis = findMakeNsis();
    const rawBaseName = `${config.suiteName.replace(/[^a-zA-Z0-9_-]/g, '-')}-Setup-v${config.version}.exe`;
    const outInstaller = path.join(releaseDir, rawBaseName);
    const nsisArgs = [
      '/V4',
      `/DVERSION=${config.version}`,
      `/DOUT_FILE=${outInstaller}`,
      `/DSERVER_DIR=${path.join(root, 'apps/server/release/win-unpacked')}`,
      `/DMANAGER_DIR=${path.join(root, 'apps/manager/release/win-unpacked')}`,
      `/DSTUDENT_DIR=${path.join(root, 'apps/student/release/win-unpacked')}`,
      `/DICON_PATH=${config.iconPath || path.join(root, 'apps/manager/resources/icon.ico')}`,
      `/DLICENSE_PATH=${path.join(root, 'installer/LICENSE.txt')}`,
      `/DSUITE_NAME=${config.suiteName}`,
      `/DBRANDING_TEXT=${config.brandingText}`,
      `/DSTUDENT_NAME=${config.studentName}`,
      `/DMANAGER_NAME=${config.managerName}`,
      `/DSERVER_NAME=${config.serverName}`,
      path.join(root, 'installer/suite.nsi'),
    ];

    await runNsisWithProgress(makensis, nsisArgs);

    ['apps/server/release', 'apps/manager/release', 'apps/student/release'].forEach((dir) => {
      fs.rmSync(path.join(root, dir), { recursive: true, force: true });
    });

    const sizeMb = (fs.statSync(outInstaller).size / 1024 / 1024).toFixed(1);
    const manifest = {
      productName: config.suiteName,
      schoolName: config.schoolName,
      whitelabel: true,
      unlicensedMode: config.unlicensedMode,
      version: config.version,
      releaseDate: new Date().toISOString(),
      installer: path.basename(outInstaller),
      installerPath: outInstaller,
      sizeMb,
      components: [config.serverName, config.managerName, config.studentName],
    };
    fs.writeFileSync(path.join(releaseDir, 'release-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

    console.log(`\nWhitelabel installer built successfully: ${outInstaller} (${sizeMb} MB)\n`);
  } finally {
    clearBakedWhitelabel();
  }
}

main().catch((err) => {
  clearBakedWhitelabel();
  console.error('\nWhitelabel build failed:', err.message);
  process.exit(1);
});