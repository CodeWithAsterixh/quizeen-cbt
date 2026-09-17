const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sharedDataFile = path.join(root, 'packages/shared/src/whitelabel-data.ts');

function bakeWhitelabel(config) {
  const content = 'import { WhitelabelConfig } from \'./types/whitelabel.js\';\n\nexport const bakedWhitelabelConfig: WhitelabelConfig = ' + JSON.stringify(config, null, 2) + ';\n';
  fs.writeFileSync(sharedDataFile, content, 'utf8');
}

function clearBakedWhitelabel() {
  const content = 'import { WhitelabelConfig } from \'./types/whitelabel.js\';\n\nexport const bakedWhitelabelConfig: WhitelabelConfig = {\n  isWhitelabel: false,\n};\n';
  fs.writeFileSync(sharedDataFile, content, 'utf8');
}

module.exports = { bakeWhitelabel, clearBakedWhitelabel };