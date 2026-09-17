import fs from 'node:fs';
import path from 'node:path';
import { bakedWhitelabelConfig, LicenseState, WhitelabelConfig } from '@cbt/shared';
import { resolveDataDir } from '../../core/db/database.js';

export function getResolvedWhitelabel(): WhitelabelConfig {
  if (bakedWhitelabelConfig?.isWhitelabel) return bakedWhitelabelConfig;
  const paths = [
    path.join(resolveDataDir(), 'whitelabel.json'),
    path.join(process.cwd(), 'config', 'whitelabel.json'),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch {}
    }
  }
  return bakedWhitelabelConfig;
}

export function getWhitelabelLicenseState(hwId: string): LicenseState | null {
  const wl = getResolvedWhitelabel();
  if (!wl?.isWhitelabel || !wl?.unlicensedMode) return null;
  return {
    status: 'active',
    hardwareId: hwId,
    daysRemaining: 99999,
    license: {
      licenseId: 'whitelabel-perpetual',
      schoolName: wl.schoolName || wl.brandingText || 'Institution',
      maxStations: 99999,
      validUntil: '2099-12-31T23:59:59.000Z',
      theme: { primaryColor: wl.primaryColor, accentColor: wl.accentColor },
      branding: {
        brandName: wl.suiteName,
        schoolName: wl.schoolName,
        shortName: wl.shortName,
        appIconUrl: wl.appIconUrl,
      },
    },
  };
}
