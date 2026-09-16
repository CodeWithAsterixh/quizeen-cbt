import { app, BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';

export interface BrandingInfo {
  schoolName?: string;
  appName?: string;
  shortName?: string;
  appIconUrl?: string;
  logoUrl?: string;
}

function ensureIcoFromPng(pngBuf: Buffer): Buffer {
  const h = Buffer.alloc(22);
  h.writeUInt16LE(1, 2); h.writeUInt16LE(1, 4);
  h.writeUInt32LE(pngBuf.length, 14); h.writeUInt32LE(22, 18);
  return Buffer.concat([h, pngBuf]);
}

export async function applyRuntimeBranding(b: BrandingInfo, win: BrowserWindow | null): Promise<boolean> {
  if (!b) return false;
  const brandName = b.appName || b.schoolName;
  if (!brandName) return false;
  const newTitle = `${brandName} Student Portal`;
  if (win) win.setTitle(newTitle);

  const brandDir = path.join(app.getPath('userData'), 'branding');
  try {
    fs.mkdirSync(brandDir, { recursive: true });
    fs.writeFileSync(path.join(brandDir, 'branding.json'), JSON.stringify(b), 'utf8');
  } catch {}
  if (process.platform !== 'win32') return true;

  let iconPath = '';
  const rawIcon = b.appIconUrl || b.logoUrl;
  if (rawIcon) {
    try {
      let buf: Buffer | null = null;
      if (fs.existsSync(rawIcon)) buf = fs.readFileSync(rawIcon);
      else if (rawIcon.startsWith('data:image')) {
        const b64 = rawIcon.split(',')[1];
        if (b64) buf = Buffer.from(b64, 'base64');
      } else if (rawIcon.startsWith('http')) {
        const res = await fetch(rawIcon);
        if (res.ok) buf = Buffer.from(await res.arrayBuffer());
      }
      if (buf) {
        const isIco = buf.subarray(0, 4).toString('hex') === '00000100';
        iconPath = path.join(brandDir, 'app_icon.ico');
        fs.writeFileSync(iconPath, isIco ? buf : ensureIcoFromPng(buf));
        if (win) win.setIcon(iconPath);
      }
    } catch {}
  }

  const sDirs = [
    path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs'),
    process.env.PROGRAMDATA ? path.join(process.env.PROGRAMDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs') : '',
    app.getPath('desktop'),
    process.env.PUBLIC ? path.join(process.env.PUBLIC, 'Desktop') : '',
  ].filter(Boolean);

  const ps: string[] = [];
  const findLnk = (dir: string) => {
    try {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) findLnk(full);
        else if (e.isFile() && e.name.toLowerCase().endsWith('.lnk')) {
          const l = e.name.toLowerCase();
          if (l.includes('student') || l.includes('queez')) {
            const newLnk = path.join(dir, `${newTitle}.lnk`);
            if (full !== newLnk) { try { fs.renameSync(full, newLnk); } catch {} }
            const tgt = fs.existsSync(newLnk) ? newLnk : full;
            if (iconPath) ps.push(`$s=(New-Object -ComObject WScript.Shell).CreateShortcut('${tgt.replace(/'/g, "''")}');$s.IconLocation='${iconPath.replace(/'/g, "''")},0';$s.Save()`);
          }
        }
      }
    } catch {}
  };
  sDirs.forEach(findLnk);

  if (ps.length > 0) {
    exec(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${ps.join(';')}"`, () => {
      exec('ie4uinit.exe -show', () => {});
    });
  }
  return true;
}

export function applyCachedBranding(win: BrowserWindow | null) {
  try {
    const f = path.join(app.getPath('userData'), 'branding', 'branding.json');
    if (fs.existsSync(f)) applyRuntimeBranding(JSON.parse(fs.readFileSync(f, 'utf8')), win);
  } catch {}
}
