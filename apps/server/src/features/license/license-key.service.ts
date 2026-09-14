import fs from 'node:fs';
import path from 'node:path';
import { resolveDataDir } from '../../core/db/database.js';

let cachedKey: string | null = null;

export function getLicensePublicKey(): string | null {
  if (cachedKey) return cachedKey;

  if (process.env.QUEEZ_LICENSE_PUBLIC_KEY) {
    cachedKey = process.env.QUEEZ_LICENSE_PUBLIC_KEY.trim();
    return cachedKey;
  }

  const candidatePaths = [
    path.join(resolveDataDir(), 'license-public.pem'),
    path.join(resolveDataDir(), 'keys', 'license-public.pem'),
    path.resolve(process.cwd(), 'config', 'license-public.pem'),
  ];

  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        cachedKey = fs.readFileSync(p, 'utf8').trim();
        return cachedKey;
      }
    } catch {}
  }

  return null;
}

export function saveLicensePublicKey(pemKey: string): void {
  cachedKey = pemKey.trim();
  const target = path.join(resolveDataDir(), 'license-public.pem');
  try {
    fs.writeFileSync(target, cachedKey, 'utf8');
  } catch {}
}
