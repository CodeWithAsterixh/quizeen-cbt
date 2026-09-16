import { app, BrowserWindow } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';

export interface BrandingInfo {
  schoolName?: string;
  appName?: string;
  shortName?: string;
  appIconUrl?: string;
}

function ensureIcoFromPng(pngBuf: Buffer): Buffer {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(0, 6);
  header.writeUInt8(0, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(pngBuf.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, pngBuf]);
}

export async function applyRuntimeBranding(
  branding: BrandingInfo,
  win: BrowserWindow | null
): Promise<boolean> {
  if (!branding) return false;
  const brandName = branding.appName || branding.schoolName;
  if (!brandName) return false;

  const newTitle = `${brandName} Student Portal`;
  if (win) win.setTitle(newTitle);
  if (process.platform !== 'win32') return true;

  const brandDir = path.join(app.getPath('userData'), 'branding');
  try { fs.mkdirSync(brandDir, { recursive: true }); } catch {}

  let iconPath = '';
  if (branding.appIconUrl) {
    try {
      let buf: Buffer | null = null;
      if (branding.appIconUrl.startsWith('data:image')) {
        const base64 = branding.appIconUrl.split(',')[1];
        if (base64) buf = Buffer.from(base64, 'base64');
      } else if (branding.appIconUrl.startsWith('http')) {
        const res = await fetch(branding.appIconUrl);
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

  const searchDirs = [
    path.join(app.getPath('appData'), 'Microsoft', 'Windows', 'Start Menu', 'Programs'),
    app.getPath('desktop'),
  ];

  const psScript: string[] = [];
  for (const sDir of searchDirs) {
    if (!fs.existsSync(sDir)) continue;
    const findLnk = (dir: string) => {
      try {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, e.name);
          if (e.isDirectory()) findLnk(full);
          else if (e.isFile() && e.name.toLowerCase().endsWith('.lnk')) {
            const lower = e.name.toLowerCase();
            if (lower.includes('student') || lower.includes('queez')) {
              const newLnk = path.join(dir, `${newTitle}.lnk`);
              if (full !== newLnk) { try { fs.renameSync(full, newLnk); } catch {} }
              const target = fs.existsSync(newLnk) ? newLnk : full;
              if (iconPath) {
                psScript.push(`$s=(New-Object -ComObject WScript.Shell).CreateShortcut('${target.replace(/'/g, "''")}');$s.IconLocation='${iconPath.replace(/'/g, "''")},0';$s.Save()`);
              }
            }
          }
        }
      } catch {}
    };
    findLnk(sDir);
  }

  if (psScript.length > 0) {
    const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -Command "${psScript.join(';')}"`;
    exec(cmd, () => { exec('ie4uinit.exe -show', () => {}); });
  }

  return true;
}
