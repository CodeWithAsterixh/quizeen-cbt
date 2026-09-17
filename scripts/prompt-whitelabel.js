const readline = require('readline');
const fs = require('fs');

function askQuestion(rl, query, defaultVal = '') {
  return new Promise((resolve) => {
    const promptText = defaultVal ? `${query} [${defaultVal}]: ` : `${query}: `;
    rl.question(promptText, (ans) => {
      resolve(ans.trim() || defaultVal);
    });
  });
}

async function promptWhitelabelConfig() {
  const args = process.argv.slice(2);
  const configArg = args.find(a => a.startsWith('--config='))?.split('=')[1];
  if (configArg && fs.existsSync(configArg)) {
    const raw = JSON.parse(fs.readFileSync(configArg, 'utf8'));
    return { isWhitelabel: true, ...raw };
  }

  const schoolArg = args.find(a => a.startsWith('--school='))?.split('=')[1];
  const isWhitelabelFlag = args.includes('--whitelabel') || Boolean(schoolArg);

  if (!process.stdin.isTTY && !isWhitelabelFlag) {
    return { isWhitelabel: false };
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    let mode = '1';
    if (isWhitelabelFlag) {
      mode = '2';
    } else {
      console.log('\nSelect Release Packaging Mode:');
      console.log('  [1] Standard Queez CBT Suite');
      console.log('  [2] Custom Whitelabel / Institutional Build');
      mode = await askQuestion(rl, 'Enter choice (1 or 2)', '1');
    }

    if (mode !== '2') {
      return { isWhitelabel: false };
    }

    console.log('\n--- Custom Institutional Whitelabel Setup ---');
    const schoolName = schoolArg || await askQuestion(rl, 'Institution or School Name', 'Apex Academy');
    const suiteName = await askQuestion(rl, 'Suite Title', `${schoolName} CBT Suite`);
    const shortName = await askQuestion(rl, 'Short Institution Name / Acronym', schoolName.split(' ')[0]);
    const studentName = await askQuestion(rl, 'Student Portal Name', `${schoolName} Student Portal`);
    const managerName = await askQuestion(rl, 'Manager Console Name', `${schoolName} Assessment Manager`);
    const serverName = await askQuestion(rl, 'Server Application Name', `${schoolName} Local Server`);
    const primaryColor = await askQuestion(rl, 'Primary Brand Color (hex)', '#059669');
    const accentColor = await askQuestion(rl, 'Secondary Accent Color (hex)', '#0d9488');
    const noLicenseAns = await askQuestion(rl, 'Build license-free (no key activation required)? (Y/n)', 'Y');
    const unlicensedMode = args.includes('--no-license') || noLicenseAns.toLowerCase() !== 'n';
    const iconPath = await askQuestion(rl, 'Custom .ico path (leave blank for standard icon)', '');

    return {
      isWhitelabel: true,
      unlicensedMode,
      schoolName,
      shortName,
      suiteName,
      brandingText: schoolName,
      studentName,
      managerName,
      serverName,
      primaryColor,
      accentColor,
      iconPath: iconPath && fs.existsSync(iconPath) ? iconPath : undefined,
    };
  } finally {
    rl.close();
  }
}

module.exports = { promptWhitelabelConfig };
