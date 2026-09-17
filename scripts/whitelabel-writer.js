const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sharedDataFile = path.join(root, 'packages/shared/src/whitelabel-data.ts');

const BUILDER_FILES = [
  { file: path.join(root, 'apps/manager/electron-builder.json'), key: 'managerName', fallback: 'Assessment Manager', sub: 'manager' },
  { file: path.join(root, 'apps/student/electron-builder.json'), key: 'studentName', fallback: 'Student Portal', sub: 'student' },
  { file: path.join(root, 'apps/server/electron-builder.json'), key: 'serverName', fallback: 'Local Server', sub: 'server' },
];

function sanitizeConfig(config) {
  return {
    isWhitelabel: Boolean(config.isWhitelabel),
    unlicensedMode: Boolean(config.unlicensedMode),
    suiteName: config.suiteName || undefined,
    schoolName: config.schoolName || undefined,
    shortName: config.shortName || undefined,
    brandingText: config.brandingText || undefined,
    serverName: config.serverName || undefined,
    managerName: config.managerName || undefined,
    studentName: config.studentName || undefined,
    primaryColor: config.primaryColor || undefined,
    accentColor: config.accentColor || undefined,
    iconPath: config.iconPath || undefined,
    appIconUrl: config.appIconUrl || undefined,
    logo: config.logo || undefined,
    badges: config.badges || undefined,
    badgeColors: config.badgeColors || undefined,
    version: config.version || undefined,
  };
}

function updateElectronBuilders(config) {
  const short = (config.shortName || 'app').toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const item of BUILDER_FILES) {
    if (!fs.existsSync(item.file)) continue;
    const backup = `${item.file}.original`;
    if (!fs.existsSync(backup)) fs.copyFileSync(item.file, backup);
    const json = JSON.parse(fs.readFileSync(backup, 'utf8'));
    json.productName = config[item.key] || `${config.schoolName || 'Custom'} ${item.fallback}`;
    json.appId = `com.${short}.cbt.${item.sub}`;
    if (config.schoolName) json.copyright = `Copyright (C) 2026 ${config.schoolName}`;
    fs.writeFileSync(item.file, JSON.stringify(json, null, 2) + '\n', 'utf8');
  }
}

function restoreElectronBuilders() {
  for (const item of BUILDER_FILES) {
    const backup = `${item.file}.original`;
    if (fs.existsSync(backup)) {
      fs.copyFileSync(backup, item.file);
      try { fs.unlinkSync(backup); } catch {}
    }
  }
}

function bakeWhitelabel(config) {
  const sanitized = sanitizeConfig(config);
  const content = 'import { WhitelabelConfig } from \'./types/whitelabel.js\';\n\nexport const bakedWhitelabelConfig: WhitelabelConfig = ' + JSON.stringify(sanitized, null, 2) + ';\n';
  fs.writeFileSync(sharedDataFile, content, 'utf8');
  if (config.isWhitelabel) updateElectronBuilders(config);
}

function clearBakedWhitelabel() {
  const content = 'import { WhitelabelConfig } from \'./types/whitelabel.js\';\n\nexport const bakedWhitelabelConfig: WhitelabelConfig = {\n  isWhitelabel: false,\n};\n';
  fs.writeFileSync(sharedDataFile, content, 'utf8');
  restoreElectronBuilders();
}

module.exports = { bakeWhitelabel, clearBakedWhitelabel, restoreElectronBuilders };