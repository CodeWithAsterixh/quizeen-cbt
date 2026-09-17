const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { promptVersion } = require('./bump-version.js');
const { runNsisWithProgress } = require('./run-nsis.js');
const { findMakeNsis } = require('./find-makensis.js');
const { promptWhitelabelConfig } = require('./prompt-whitelabel.js');
const { bakeWhitelabel, clearBakedWhitelabel } = require('./whitelabel-writer.js');
const { backupOriginalIcons, cleanupWhitelabelBuild } = require('./clean-whitelabel.js');

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

async function main() {
  console.log('=== Queez CBT Unified Suite Release Builder ===');
  const version = await promptVersion();
  const whitelabel = await promptWhitelabelConfig();
  const releaseDir = path.join(root, '.qzn-releases', `v${version}`);
  fs.mkdirSync(releaseDir, { recursive: true });

  try {
    if (whitelabel.isWhitelabel) {
      console.log('\n--- Baking Whitelabel Configuration ---');
      bakeWhitelabel(whitelabel);
      backupOriginalIcons(root);
    } else {
      clearBakedWhitelabel();
    }

    console.log('\n--- Step 1: Generating Icons ---');
    let iconCmd = 'node scripts/generate-icons.js';
    if (whitelabel.isWhitelabel) {
      if (whitelabel.iconPath) iconCmd += ` --logo="${whitelabel.iconPath}"`;
      if (whitelabel.primaryColor) iconCmd += ` --primary="${whitelabel.primaryColor}"`;
      if (whitelabel.accentColor) iconCmd += ` --accent="${whitelabel.accentColor}"`;
      if (whitelabel.schoolName) iconCmd += ` --school="${whitelabel.schoolName}"`;
      if (whitelabel.shortName) iconCmd += ` --short="${whitelabel.shortName}"`;
    }
    run(iconCmd);

    console.log('\n--- Step 2: Packaging Server, Manager, and Student in Parallel ---');
    await Promise.all([
      runAsync('npm --workspace=apps/server run electron:pack'),
      runAsync('npm --workspace=apps/manager run electron:pack'),
      runAsync('npm --workspace=apps/student run electron:pack'),
    ]);

    console.log('\n--- Step 2.5: Staging Updates for Central Server ---');
    run('node scripts/stage-server-updates.js');

    console.log('\n--- Step 3: Compiling Unified Suite Installer ---');
    const makensis = findMakeNsis();
    const rawBaseName = whitelabel.isWhitelabel
      ? `${whitelabel.suiteName.replace(/[^a-zA-Z0-9_-]/g, '-')}-Setup-v${version}.exe`
      : `Queez-CBT-Suite-Setup-v${version}.exe`;
    const outInstaller = path.join(releaseDir, rawBaseName);
    const nsisArgs = [
      '/V4',
      `/DVERSION=${version}`,
      `/DOUT_FILE=${outInstaller}`,
      `/DSERVER_DIR=${path.join(root, 'apps/server/release/win-unpacked')}`,
      `/DMANAGER_DIR=${path.join(root, 'apps/manager/release/win-unpacked')}`,
      `/DSTUDENT_DIR=${path.join(root, 'apps/student/release/win-unpacked')}`,
      `/DICON_PATH=${path.join(root, 'installer/resources/installer.ico')}`,
      `/DUNICON_PATH=${path.join(root, 'installer/resources/uninstall.ico')}`,
      `/DLICENSE_PATH=${path.join(root, 'installer/LICENSE.txt')}`,
    ];

    if (whitelabel.isWhitelabel) {
      if (whitelabel.suiteName) nsisArgs.push(`/DSUITE_NAME=${whitelabel.suiteName}`);
      if (whitelabel.brandingText) nsisArgs.push(`/DBRANDING_TEXT=${whitelabel.brandingText}`);
      if (whitelabel.studentName) nsisArgs.push(`/DSTUDENT_NAME=${whitelabel.studentName}`);
      if (whitelabel.managerName) nsisArgs.push(`/DMANAGER_NAME=${whitelabel.managerName}`);
      if (whitelabel.serverName) nsisArgs.push(`/DSERVER_NAME=${whitelabel.serverName}`);
    }

    nsisArgs.push(path.join(root, 'installer/suite.nsi'));
    await runNsisWithProgress(makensis, nsisArgs);

    const sizeMb = (fs.statSync(outInstaller).size / 1024 / 1024).toFixed(1);
    console.log(`\nInstaller built successfully: ${outInstaller} (${sizeMb} MB)\n`);
  } finally {
    clearBakedWhitelabel();
    cleanupWhitelabelBuild(root, releaseDir, whitelabel?.iconPath);
  }
}

main().catch((err) => { console.error('\nRelease build failed:', err.message); process.exit(1); });
