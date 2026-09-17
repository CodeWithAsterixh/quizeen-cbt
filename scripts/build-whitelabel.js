const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { runNsisWithProgress } = require('./run-nsis.js');
const { findMakeNsis } = require('./find-makensis.js');
const { bakeWhitelabel, clearBakedWhitelabel } = require('./whitelabel-writer.js');
const { backupOriginalIcons, cleanupWhitelabelBuild } = require('./clean-whitelabel.js');

const root = path.resolve(__dirname, '..');

function run(cmd, cwd = root) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', env: process.env });
}

const activeChildren = new Set();

function killAllActiveChildren() {
  for (const child of activeChildren) {
    try {
      if (child.pid) {
        if (process.platform === 'win32') {
          require('child_process').spawnSync('taskkill', ['/F', '/T', '/PID', String(child.pid)], { stdio: 'ignore' });
        } else {
          child.kill('SIGTERM');
        }
      }
    } catch {}
  }
  activeChildren.clear();
}

process.on('SIGINT', () => { killAllActiveChildren(); process.exit(1); });
process.on('SIGTERM', () => { killAllActiveChildren(); process.exit(1); });
process.on('exit', () => { killAllActiveChildren(); });

function runAsync(cmd, label = 'App') {
  return new Promise((resolve, reject) => {
    console.log(`[${label}] Build started`);
    const child = spawn(cmd, { cwd: root, shell: true, env: process.env });
    activeChildren.add(child);

    const handleData = (chunk) => {
      const lines = chunk.toString().split(/\r?\n/);
      for (const raw of lines) {
        const line = raw.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '').trim();
        if (!line) continue;
        if (/KaTeX_|\.woff|\.ttf|DEP0190|DeprecationWarning|Unknown env config|computing gzip size/i.test(line)) continue;
        if (/Some chunks are larger than 500 kB|rollupOptions\.output\.manualChunks|chunkSizeWarningLimit/i.test(line)) continue;
        if (/duplicate dependency references|searching for node modules|loaded configuration/i.test(line)) continue;
        if (line === '•' || line === 'transforming...' || line === 'rendering chunks...') continue;

        if (line.includes('building for production')) {
          console.log(`[${label}] Compiling frontend bundle with Vite...`);
        } else if (line.includes('modules transformed')) {
          const m = line.match(/(\d+)\s+modules/);
          console.log(`[${label}] Transformed ${m ? m[1] : ''} modules`);
        } else if (line.includes('built in')) {
          console.log(`[${label}] Frontend build completed`);
        } else if (line.includes('packaging') && line.includes('platform=win32')) {
          console.log(`[${label}] Packaging Electron application binary...`);
        } else if (line.includes('downloaded electron')) {
          console.log(`[${label}] Verified Electron runtime`);
        }
      }
    };

    child.stdout.on('data', handleData);
    child.stderr.on('data', handleData);

    child.on('close', (code) => {
      activeChildren.delete(child);
      if (code === 0) {
        console.log(`[${label}] Packaging completed successfully`);
        resolve();
      } else {
        reject(new Error(`[${label}] Command failed with exit code ${code}`));
      }
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
  const primary = getArg('primary', base.primaryColor || '#059669');
  const accent = getArg('accent', base.accentColor || '#0d9488');
  const version = getArg('version', base.version || '2.0.0');
  const iconRaw = getArg('icon', getArg('logo', base.iconPath || base.logo || base.appIconUrl || ''));
  let resolvedIcon = iconRaw && fs.existsSync(iconRaw) ? iconRaw : '';
  let dataUriLogo = '';

  if (base.logo && typeof base.logo === 'string' && base.logo.startsWith('data:image/')) {
    dataUriLogo = base.logo;
  } else if (iconRaw && iconRaw.startsWith('data:image/')) {
    dataUriLogo = iconRaw;
  } else if (resolvedIcon && fs.existsSync(resolvedIcon)) {
    try {
      const ext = path.extname(resolvedIcon).toLowerCase();
      const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
      dataUriLogo = `data:${mime};base64,${fs.readFileSync(resolvedIcon).toString('base64')}`;
    } catch {}
  }

  if (!resolvedIcon && dataUriLogo) {
    try {
      const match = dataUriLogo.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        const ext = match[1] === 'svg+xml' ? 'svg' : match[1];
        const tempPath = path.join(root, '.qzn-releases', `temp-logo-${Date.now()}.${ext}`);
        fs.mkdirSync(path.dirname(tempPath), { recursive: true });
        fs.writeFileSync(tempPath, Buffer.from(match[2], 'base64'));
        resolvedIcon = tempPath;
      }
    } catch {}
  }
  const outDir = getArg('out', base.outDir || '');
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
    logo: dataUriLogo || undefined,
    appIconUrl: dataUriLogo || undefined,
    iconPath: resolvedIcon || undefined,
    badges: base.badges,
    badgeColors: base.badgeColors,
    version,
    outDir: outDir ? path.resolve(outDir) : undefined,
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

  const releaseDir = config.outDir || path.join(root, '.qzn-releases', `v${config.version}-${config.shortName.toLowerCase()}`);
  fs.mkdirSync(releaseDir, { recursive: true });

  try {
    bakeWhitelabel(config);

    if (config.isDryRun) {
      console.log('\n[Dry Run] Configuration baked successfully. Skipping packaging and NSIS.');
      fs.writeFileSync(path.join(releaseDir, 'dry-run-manifest.json'), JSON.stringify(config, null, 2), 'utf8');
      return;
    }

    console.log('\n--- Step 1: Generating Icons ---');
    backupOriginalIcons(root);
    let iconCmd = 'node scripts/generate-icons.js';
    if (config.iconPath) iconCmd += ` --logo="${config.iconPath}"`;
    if (config.primaryColor) iconCmd += ` --primary="${config.primaryColor}"`;
    if (config.accentColor) iconCmd += ` --accent="${config.accentColor}"`;
    if (config.schoolName) iconCmd += ` --school="${config.schoolName}"`;
    if (config.shortName) iconCmd += ` --short="${config.shortName}"`;
    run(iconCmd);

    console.log('\n--- Step 2: Packaging Applications in Parallel ---');
    await Promise.all([
      runAsync('npm --workspace=apps/server run electron:pack', 'Server'),
      runAsync('npm --workspace=apps/manager run electron:pack', 'Manager'),
      runAsync('npm --workspace=apps/student run electron:pack', 'Student'),
    ]);

    console.log('\n--- Step 2.5: Staging Updates for Central Server ---');
    run('node scripts/stage-server-updates.js');

    console.log('\n--- Step 3: Compiling Unified Suite Installer ---');
    const makensis = findMakeNsis();
    const rawBaseName = `${config.suiteName.replace(/[^a-zA-Z0-9_-]/g, '-')}-Setup-v${config.version}.exe`;
    const outInstaller = path.join(releaseDir, rawBaseName);
    const defsPath = path.join(root, 'installer', 'whitelabel-defs.nsh');

    const whitelabelLicensePath = path.join(releaseDir, 'LICENSE.txt');
    const licenseText = [
      `${config.suiteName.toUpperCase()}`,
      `POWERED BY QUEEZ CBT`,
      `END USER LICENSE AGREEMENT AND TERMS OF USE`,
      ``,
      `Please read these terms carefully before installing or using ${config.suiteName}.`,
      ``,
      `1. SCOPE AND ACCEPTANCE`,
      `By installing, copying, or using this software, you agree to be bound by these terms. If you do not agree to these terms, click "Cancel" to abort the installation.`,
      ``,
      `2. SOFTWARE DESCRIPTION`,
      `${config.suiteName} is an offline computer based testing platform powered by Queez CBT, configured for ${config.schoolName}. It includes three interconnected applications:`,
      `- ${config.serverName}: The local network assessment and database engine.`,
      `- ${config.managerName}: The administration portal for creating tests, managing students, and marking submissions.`,
      `- ${config.studentName}: The examination client used by students to take tests.`,
      ``,
      `3. LICENSE GRANT`,
      `You are granted a non-exclusive, non-transferable license to install and run the software on computers within your institution or testing center for educational and assessment purposes.`,
      ``,
      `4. OFFLINE DATA AND PRIVACY`,
      `All student records, exam questions, credentials, and test submissions are processed and stored locally on your institution host computer and network. No examination content or student records are transmitted to external servers without your explicit action. Your institution remains the sole custodian of your local assessment data.`,
      ``,
      `5. RESTRICTIONS`,
      `You may not reverse engineer, decompile, or tamper with examination records or student scores.`,
      ``,
      `6. DISCLAIMER OF WARRANTIES`,
      `The software is provided "as is" without warranty of any kind. Always verify local network connectivity and battery backups before live examinations.`,
    ].join('\r\n');
    fs.writeFileSync(whitelabelLicensePath, licenseText, 'utf8');

    const defs = [
      `!define VERSION "${config.version}"`,
      `!define OUT_FILE "${outInstaller.replace(/\\/g, '\\\\')}"`,
      `!define SERVER_DIR "${path.join(root, 'apps/server/release/win-unpacked').replace(/\\/g, '\\\\')}"`,
      `!define MANAGER_DIR "${path.join(root, 'apps/manager/release/win-unpacked').replace(/\\/g, '\\\\')}"`,
      `!define STUDENT_DIR "${path.join(root, 'apps/student/release/win-unpacked').replace(/\\/g, '\\\\')}"`,
      `!define ICON_PATH "${path.join(root, 'installer/resources/installer.ico').replace(/\\/g, '\\\\')}"`,
      `!define UNICON_PATH "${path.join(root, 'installer/resources/uninstall.ico').replace(/\\/g, '\\\\')}"`,
      `!define LICENSE_PATH "${whitelabelLicensePath.replace(/\\/g, '\\\\')}"`,
      `!define SUITE_NAME "${config.suiteName}"`,
      `!define BRANDING_TEXT "${config.brandingText} | Powered by Queez CBT"`,
      `!define STUDENT_NAME "${config.studentName}"`,
      `!define MANAGER_NAME "${config.managerName}"`,
      `!define SERVER_NAME "${config.serverName}"`,
      `!define SERVER_EXE "${config.serverName}.exe"`,
      `!define MANAGER_EXE "${config.managerName}.exe"`,
      `!define STUDENT_EXE "${config.studentName}.exe"`,
    ].join('\n');
    fs.writeFileSync(defsPath, defs, 'utf8');

    const nsisArgs = ['/V4', path.join(root, 'installer/suite.nsi')];
    await runNsisWithProgress(makensis, nsisArgs);

    const sizeMb = (fs.statSync(outInstaller).size / 1024 / 1024).toFixed(1);
    console.log(`\nWhitelabel installer built successfully: ${outInstaller} (${sizeMb} MB)\n`);
  } finally {
    clearBakedWhitelabel();
    try {
      const defsPath = path.join(root, 'installer', 'whitelabel-defs.nsh');
      if (fs.existsSync(defsPath)) fs.unlinkSync(defsPath);
    } catch {}
    cleanupWhitelabelBuild(root, releaseDir, config.iconPath);
  }
}

main().catch((err) => {
  console.error('\nWhitelabel build failed:', err.message);
  process.exit(1);
});