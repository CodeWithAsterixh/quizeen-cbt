import os from 'node:os';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

let cachedHardwareId: string | null = null;

// Read the Windows MachineGuid from the registry - set once at OS install,
// never changes unless the OS is reinstalled. Much more stable than a MAC
// address (which can be randomised on Wi-Fi under Windows 11).
function getMachineGuid(): string {
  if (process.platform !== 'win32') return '';
  try {
    const out = execSync(
      'reg query "HKLM\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid',
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 2000 }
    );
    const match = out.match(/MachineGuid\s+REG_SZ\s+([^\r\n]+)/i);
    return match ? match[1].trim().toLowerCase() : '';
  } catch {
    return '';
  }
}

// Get all non-virtual, non-loopback MAC addresses sorted for determinism.
function getStableMacs(): string[] {
  const interfaces = os.networkInterfaces();
  const macs: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (!net.internal && net.mac && net.mac !== '00:00:00:00:00:00') {
        macs.push(net.mac.toLowerCase());
      }
    }
  }
  return macs.sort();
}

export function getHardwareId(): string {
  if (cachedHardwareId) return cachedHardwareId;

  const machineGuid = getMachineGuid();
  const macs = getStableMacs();

  // Prefer Windows MachineGuid (most stable). Fall back to MAC if unavailable
  // (Linux/macOS or registry read failure).
  const primaryAnchor = machineGuid || macs[0] || '00:11:22:33:44:55';

  const rawSeed = [
    primaryAnchor,
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
