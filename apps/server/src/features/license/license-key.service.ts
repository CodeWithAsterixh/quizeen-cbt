import fs from 'node:fs';
import path from 'node:path';
import { resolveDataDir } from '../../core/db/database.js';

let cachedKey: string | null = null;

export function getLicensePublicKey(): string | null {
  if (cachedKey) return cachedKey;

  const envKey = process.env.QUEEZ_LICENSE_PUBLIC_KEY || process.env.LICENSE_PUBLIC_KEY;
  if (envKey) {
    cachedKey = envKey.replace(/\\n/g, '\n').trim();
    return cachedKey;
  }

  const envFiles = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), 'apps/server/.env'),
    path.join(resolveDataDir(), '.env'),
  ];
  for (const f of envFiles) {
    try {
      if (fs.existsSync(f)) {
        const raw = fs.readFileSync(f, 'utf8');
        const m = raw.match(/(?:QUEEZ_LICENSE_PUBLIC_KEY|LICENSE_PUBLIC_KEY)=(?:"([^"]+)"|'([^']+)'|([^\r\n]+))/);
        if (m) {
          const val = m[1] || m[2] || m[3];
          cachedKey = val.replace(/\\n/g, '\n').trim();
          return cachedKey;
        }
      }
    } catch {}
  }

  const candidatePaths = [
    path.join(resolveDataDir(), 'license-public.pem'),
    path.join(resolveDataDir(), 'keys', 'license-public.pem'),
    path.resolve(process.cwd(), 'config', 'license-public.pem'),
    path.resolve(process.cwd(), 'apps/server/config', 'license-public.pem'),
  ];

  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        const key = fs.readFileSync(p, 'utf8').trim();
        if (key.includes('BEGIN PUBLIC KEY')) {
          cachedKey = key;
          return cachedKey;
        }
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

export function clearCachedLicenseKey(): void {
  cachedKey = null;
}
