import net from 'node:net';
import http from 'node:http';

export function checkPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once('error', () => resolve(false));
    tester.once('listening', () => {
      tester.close(() => resolve(true));
    });
    tester.listen(port, '0.0.0.0');
  });
}

export async function findFallbackPort(startPort: number): Promise<number> {
  const candidates = [4050, 4100, 4200, 4500, 5000, 5050, 8080];
  for (const p of candidates) {
    if (p !== startPort && p !== 4001 && (await checkPortAvailable(p))) {
      return p;
    }
  }
  for (let p = startPort + 10; p < startPort + 100; p++) {
    if (p !== 4001 && (await checkPortAvailable(p))) return p;
  }
  return startPort;
}

export function probeQueezServer(port: number): Promise<{ active: boolean; url: string }> {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/health`, { timeout: 1200 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.service === 'cbt-server') {
            return resolve({ active: true, url: `http://127.0.0.1:${port}` });
          }
        } catch {}
        resolve({ active: false, url: '' });
      });
    });

    req.on('error', () => resolve({ active: false, url: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ active: false, url: '' }); });
  });
}
