const fs = require('fs');
const path = require('path');
const readline = require('readline');

const root = path.resolve(__dirname, '..');
const rootPkgPath = path.join(root, 'package.json');
const pkgPaths = [
  rootPkgPath,
  path.join(root, 'apps', 'manager', 'package.json'),
  path.join(root, 'apps', 'student', 'package.json'),
  path.join(root, 'apps', 'server', 'package.json'),
  path.join(root, 'packages', 'shared', 'package.json'),
];

function getNextVersion(current, level) {
  const [major, minor, patch] = current.split('.').map(Number);
  if (level === 'major' || level === '3') return `${major + 1}.0.0`;
  if (level === 'minor' || level === '2') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function checkDuplicate(version) {
  const releaseDir = path.join(root, '.qzn-releases', `v${version}`);
  if (fs.existsSync(releaseDir)) {
    throw new Error(`Version v${version} already exists in .qzn-releases! Duplicate versions are not allowed.`);
  }
}

function updatePackages(newVersion) {
  checkDuplicate(newVersion);
  for (const p of pkgPaths) {
    if (fs.existsSync(p)) {
      const json = JSON.parse(fs.readFileSync(p, 'utf8'));
      json.version = newVersion;
      fs.writeFileSync(p, JSON.stringify(json, null, 2) + '\n', 'utf8');
    }
  }
  console.log(`\nUpdated all package.json files to version ${newVersion}`);
  return newVersion;
}

async function promptVersion() {
  const current = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8')).version || '1.0.0';
  console.log(`\nCurrent version: ${current}`);
  console.log('Select update level:');
  console.log(`  1) Patch (${getNextVersion(current, 'patch')}) - Bug fixes & tweaks`);
  console.log(`  2) Minor (${getNextVersion(current, 'minor')}) - New features`);
  console.log(`  3) Major (${getNextVersion(current, 'major')}) - Major changes`);
  console.log('  4) Custom (enter specific version)');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('\nEnter choice [1-4] (default 1): ', (ans) => {
      const choice = (ans || '1').trim();
      if (choice === '4') {
        rl.question('Enter custom version (e.g. 1.2.3): ', (custom) => {
          rl.close();
          resolve(updatePackages(custom.trim().replace(/^v/, '')));
        });
      } else {
        rl.close();
        resolve(updatePackages(getNextVersion(current, choice)));
      }
    });
  });
}

if (require.main === module) {
  promptVersion().catch((err) => {
    console.error(`\nError: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { promptVersion, updatePackages, checkDuplicate, getNextVersion };
