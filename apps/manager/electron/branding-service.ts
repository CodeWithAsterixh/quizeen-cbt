import { app, BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { bakedWhitelabelConfig } from '@cbt/shared';

export interface BrandingInfo {
  schoolName?: string;
  appName?: string;
  shortName?: string;
  appIconUrl?: string;
  logoUrl?: string;
}

export function getInitialAppName(): string {
  try {
    const f = path.join(app.getPath('userData'), 'branding', 'branding.json');
    if (fs.existsSync(f)) {
      const b: BrandingInfo = JSON.parse(fs.readFileSync(f, 'utf8'));
      const name = b.appName || b.schoolName;
      if (name) return `${name} Assessment Manager`;
    }
  } catch {}
  return bakedWhitelabelConfig?.managerName || (bakedWhitelabelConfig?.schoolName ? `${bakedWhitelabelConfig.schoolName} Assessment Manager` : 'Queez CBT Manager');
}

function ensureIcoFromPng(b: Buffer): Buffer {
  const h = Buffer.alloc(22);
  h.writeUInt16LE(1, 2); h.writeUInt16LE(1, 4);
  h.writeUInt32LE(b.length, 14); h.writeUInt32LE(22, 18);
  return Buffer.concat([h, b]);
}

export async function applyRuntimeBranding(b: BrandingInfo, win: BrowserWindow | null): Promise<boolean> {
  if (!b) return false;
  const brandName = b.appName || b.schoolName;
  if (!brandName) return false;
  const newTitle = `${brandName} Assessment Manager`;
  app.name = newTitle;
  if (win) win.setTitle(newTitle);

  const brandDir = path.join(app.getPath('userData'), 'branding');
  try {
    fs.mkdirSync(brandDir, { recursive: true });
    fs.writeFileSync(path.join(brandDir, 'branding.json'), JSON.stringify(b), 'utf8');
  } catch {}
  if (process.platform !== 'win32') return true;

  const rawIcon = b.appIconUrl || b.logoUrl;
  if (rawIcon) {
    try {
      let buf: Buffer | null = null;
      if (fs.existsSync(rawIcon)) buf = fs.readFileSync(rawIcon);
      else if (rawIcon.startsWith('data:image')) buf = Buffer.from(rawIcon.split(',')[1] || '', 'base64');
      else if (rawIcon.startsWith('http')) {
        const res = await fetch(rawIcon, { signal: AbortSignal.timeout(2000) });
        if (res.ok) buf = Buffer.from(await res.arrayBuffer());
      }
      if (buf) {
        const iconPath = path.join(brandDir, 'app_icon.ico');
        fs.writeFileSync(iconPath, buf.subarray(0, 4).toString('hex') === '00000100' ? buf : ensureIcoFromPng(buf));
        if (win) win.setIcon(iconPath);
      }
    } catch {}
  }
  return true;
}

export function applyCachedBranding(win: BrowserWindow | null) {
  try {
    const f = path.join(app.getPath('userData'), 'branding', 'branding.json');
    if (fs.existsSync(f)) applyRuntimeBranding(JSON.parse(fs.readFileSync(f, 'utf8')), win);
  } catch {}
}
