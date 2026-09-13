const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promptVersion } = require('./bump-version.js');

const root = path.resolve(__dirname, '..');

function run(cmd, cwd = root) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', env: process.env });
}

function copyInstaller(appDir, destDir) {
  const relDir = path.join(appDir, 'release');
  if (!fs.existsSync(relDir)) return;
  const files = fs.readdirSync(relDir);
  const exe = files.find((f) => f.endsWith('.exe') && !f.includes('unins'));
  if (exe) {
    const src = path.join(relDir, exe);
    const dest = path.join(destDir, exe);
    fs.copyFileSync(src, dest);
    console.log(`Installer saved: ${exe} (${(fs.statSync(dest).size / 1024 / 1024).toFixed(1)} MB)`);
  }
  fs.rmSync(relDir, { recursive: true, force: true });
}

async function main() {
  console.log('=== Quizeen CBT Release Builder ===');
  const version = await promptVersion();
  const releaseDir = path.join(root, '.qzn-releases', `v${version}`);
  fs.mkdirSync(releaseDir, { recursive: true });

  run('node scripts/generate-icons.js', root);

  console.log('\n--- Building Server ---');
  run('npm --workspace=apps/server run build', root);
  const srvDist = path.join(root, 'apps', 'server', 'dist');
  const srvDest = path.join(releaseDir, 'server');
  if (fs.existsSync(srvDist)) {
    fs.mkdirSync(srvDest, { recursive: true });
    fs.cpSync(srvDist, path.join(srvDest, 'dist'), { recursive: true });
    fs.copyFileSync(path.join(root, 'apps', 'server', 'package.json'), path.join(srvDest, 'package.json'));
    console.log('Server build saved to release.');
  }

  console.log('\n--- Building Manager Electron App ---');
  run('npm --workspace=apps/manager run electron:build', root);
  copyInstaller(path.join(root, 'apps', 'manager'), releaseDir);

  console.log('\n--- Building Student Electron App ---');
  run('npm --workspace=apps/student run electron:build', root);
  copyInstaller(path.join(root, 'apps', 'student'), releaseDir);

  const manifest = {
    version,
    releaseDate: new Date().toISOString(),
    outputFolder: `.qzn-releases/v${version}`,
    files: fs.readdirSync(releaseDir).map((name) => {
      const p = path.join(releaseDir, name);
      const stat = fs.statSync(p);
      return { name, isDirectory: stat.isDirectory(), sizeBytes: stat.size };
    }),
  };
  fs.writeFileSync(path.join(releaseDir, 'release-manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`\nRelease v${version} created successfully in: ${releaseDir}\n`);
}

main().catch((err) => {
  console.error('\nRelease build failed:', err.message);
  process.exit(1);
});
