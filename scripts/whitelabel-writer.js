const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sharedDataFile = path.join(root, 'packages/shared/src/whitelabel-data.ts');

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
    version: config.version || undefined,
  };
}

function bakeWhitelabel(config) {
  const sanitized = sanitizeConfig(config);
  const content = 'import { WhitelabelConfig } from \'./types/whitelabel.js\';\n\nexport const bakedWhitelabelConfig: WhitelabelConfig = ' + JSON.stringify(sanitized, null, 2) + ';\n';
  fs.writeFileSync(sharedDataFile, content, 'utf8');
}

function clearBakedWhitelabel() {
  const content = 'import { WhitelabelConfig } from \'./types/whitelabel.js\';\n\nexport const bakedWhitelabelConfig: WhitelabelConfig = {\n  isWhitelabel: false,\n};\n';
  fs.writeFileSync(sharedDataFile, content, 'utf8');
}

module.exports = { bakeWhitelabel, clearBakedWhitelabel };