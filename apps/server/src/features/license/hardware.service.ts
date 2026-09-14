import os from 'node:os';
import crypto from 'node:crypto';

let cachedHardwareId: string | null = null;

export function getHardwareId(): string {
  if (cachedHardwareId) return cachedHardwareId;

  const interfaces = os.networkInterfaces();
  const macs: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (!net.internal && net.mac && net.mac !== '00:00:00:00:00:00') {
        macs.push(net.mac.toLowerCase());
      }
    }
  }

  macs.sort();
  const rawSeed = [
    macs[0] || '00:11:22:33:44:55',
    os.hostname().toLowerCase(),
    os.platform(),
    os.arch(),
  ].join('|');

  const hash = crypto.createHash('sha256').update(rawSeed).digest('hex').toUpperCase();
  const part1 = hash.slice(0, 4);
  const part2 = hash.slice(4, 8);
  const part3 = hash.slice(8, 12);
  const part4 = hash.slice(12, 16);

  cachedHardwareId = `QZN-HW-${part1}-${part2}-${part3}-${part4}`;
  return cachedHardwareId;
}
