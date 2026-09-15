import fs from 'node:fs';
import path from 'node:path';
import { resolveDataDir } from '../../core/db/database.js';

export function normalizePortalUrl(raw?: string): string {
  if (!raw) return '';
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function getLicensingPortalUrl(override?: string): string {
  if (override) return normalizePortalUrl(override);
  if (process.env.LICENSING_PORTAL_URL) {
    return normalizePortalUrl(process.env.LICENSING_PORTAL_URL);
  }
  const file = path.join(resolveDataDir(), 'portal-url.txt');
  try {
    if (fs.existsSync(file)) {
      return normalizePortalUrl(fs.readFileSync(file, 'utf8'));
    }
  } catch {}
  return '';
}

export function setLicensingPortalUrl(url: string): void {
  const normalized = normalizePortalUrl(url);
  const file = path.join(resolveDataDir(), 'portal-url.txt');
  try {
    fs.writeFileSync(file, normalized, 'utf8');
  } catch {}
}
