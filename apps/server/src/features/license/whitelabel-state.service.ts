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
      issuedAt: '2024-01-01T00:00:00.000Z',
      validUntil: '2099-12-31T23:59:59.000Z',
      term: 'Perpetual',
      hardwareId: hwId,
      stationLimit: 99999,
      theme: {
        primaryColor: wl.primaryColor || '#059669',
        accentColor: wl.accentColor || '#0d9488',
        surfaceMode: 'light',
        borderRadius: 'md',
        fontPreset: 'inter',
      },
      branding: {
        schoolName: wl.schoolName || wl.brandingText || 'Institution',
        appName: wl.suiteName || 'CBT Suite',
        shortName: wl.shortName || 'CBT',
        schoolCode: wl.shortName || 'CBT',
        appIconUrl: wl.appIconUrl,
      },
    },
  };
}
