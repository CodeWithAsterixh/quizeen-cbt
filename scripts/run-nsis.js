const { spawn } = require('child_process');

function runNsisWithProgress(makensisPath, nsisArgs) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let fileCount = 0;
    let lastReport = 0;
    const tailLines = [];

    const child = spawn(makensisPath, nsisArgs, { stdio: ['ignore', 'pipe', 'pipe'] });

    const timer = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      process.stdout.write(`\r[NSIS Progress] Packaging suite: ${fileCount} files processed (${elapsed}s elapsed)...   `);
    }, 1000);

    const onLine = (rawLine) => {
      const line = rawLine.trim();
      if (!line) return;
      tailLines.push(line);
      if (tailLines.length > 30) tailLines.shift();

      if (line.startsWith('File:')) {
        fileCount++;
        const now = Date.now();
        if (now - lastReport > 200) {
          lastReport = now;
          const elapsed = Math.round((now - startTime) / 1000);
          process.stdout.write(`\r[NSIS Progress] Packaging suite: ${fileCount} files processed (${elapsed}s elapsed)...   `);
        }
      } else if (line.includes('Section: "Queez Local Server"')) {
        process.stdout.write(`\n[NSIS] Packaging Queez Local Server components...\n`);
      } else if (line.includes('Section: "Queez Assessment Manager"')) {
        process.stdout.write(`\n[NSIS] Packaging Queez Assessment Manager components...\n`);
      } else if (line.includes('Section: "Queez Student Portal"')) {
        process.stdout.write(`\n[NSIS] Packaging Queez Student Portal components...\n`);
      } else if (line.includes('Section: "-Post"')) {
        process.stdout.write(`\n[NSIS] Finalizing shortcuts, firewall rules, and metadata...\n`);
      } else if (line.startsWith('Error:') || line.startsWith('Error in') || line.toLowerCase().startsWith('warning')) {
        process.stderr.write(`\n[NSIS] ${line}\n`);
      }
    };

    let buffer = '';
    child.stdout.on('data', (chunk) => {
      buffer += chunk.toString();
      const parts = buffer.split(/\r?\n/);
      buffer = parts.pop();
      for (const p of parts) onLine(p);
    });

    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      tailLines.push(text);
      process.stderr.write(text);
    });

    child.on('close', (code) => {
      clearInterval(timer);
      const totalElapsed = Math.round((Date.now() - startTime) / 1000);
      process.stdout.write(`\r[NSIS Progress] Completed in ${totalElapsed}s (${fileCount} files packaged).\n`);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`NSIS compilation failed with code ${code}.\n${tailLines.slice(-15).join('\n')}`));
      }
    });

    child.on('error', (err) => {
      clearInterval(timer);
      reject(err);
    });
  });
}

module.exports = { runNsisWithProgress };
