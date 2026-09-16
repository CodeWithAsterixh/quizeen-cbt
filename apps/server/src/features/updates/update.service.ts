import fs from 'node:fs';
import path from 'node:path';
import { db } from '../../core/db/database.js';
import { UpdateCheckResult } from '@cbt/shared';

export interface AppManifestItem {
  version: string;
  filename: string;
  releaseNotes?: string;
  sha256?: string;
}

class UpdateService {
  private getUpdatesDir(): string {
    const list = [
      typeof (db as any).getDataDir === 'function' ? path.join((db as any).getDataDir(), 'updates') : '',
      path.resolve(process.cwd(), 'apps', 'server', 'data', 'updates'),
      path.resolve(process.cwd(), 'data', 'updates'),
    ].filter(Boolean);
    for (const p of list) { if (fs.existsSync(path.join(p, 'manifest.json'))) return p; }
    for (const p of list) { if (fs.existsSync(p)) return p; }
    const fallback = list[0] || path.resolve(process.cwd(), 'data', 'updates');
    try { fs.mkdirSync(fallback, { recursive: true }); } catch {}
    return fallback;
  }

  private getManifest(): Record<string, AppManifestItem> {
    const manifestPath = path.join(this.getUpdatesDir(), 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      } catch {}
    }
    return {};
  }

  checkForUpdate(app: string, clientVersion: string): UpdateCheckResult {
    const manifest = this.getManifest();
    const item = manifest[app];

    if (!item || !item.version) {
      return { updateAvailable: false, currentVersion: clientVersion, latestVersion: clientVersion };
    }

    const isNewer = this.compareSemver(item.version, clientVersion) > 0;
    const filePath = path.join(this.getUpdatesDir(), item.filename);
    const fileExists = fs.existsSync(filePath);

    if (!isNewer || !fileExists) {
      return { updateAvailable: false, currentVersion: clientVersion, latestVersion: item.version };
    }

    const stat = fs.statSync(filePath);
    return {
      updateAvailable: true,
      currentVersion: clientVersion,
      latestVersion: item.version,
      downloadUrl: `/api/updates/download/${app}`,
      packageSize: stat.size,
      sha256: item.sha256,
      releaseNotes: item.releaseNotes || `Version ${item.version} update.`,
    };
  }

  getUpdateFile(app: string): { filePath: string; filename: string; size: number } | null {
    const manifest = this.getManifest();
    const item = manifest[app];
    if (!item || !item.filename) return null;

    const filePath = path.join(this.getUpdatesDir(), item.filename);
    if (!fs.existsSync(filePath)) return null;

    const stat = fs.statSync(filePath);
    return { filePath, filename: item.filename, size: stat.size };
  }

  getStagedUpdates(): Record<string, AppManifestItem & { exists: boolean; size?: number }> {
    const manifest = this.getManifest();
    const res: Record<string, AppManifestItem & { exists: boolean; size?: number }> = {};
    for (const [k, v] of Object.entries(manifest)) {
      const p = path.join(this.getUpdatesDir(), v.filename);
      const exists = fs.existsSync(p);
      res[k] = { ...v, exists, size: exists ? fs.statSync(p).size : 0 };
    }
    return res;
  }

  private compareSemver(a: string, b: string): number {
    const pa = a.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);
    const pb = b.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);
    for (let i = 0; i < 3; i++) { const diff = (pa[i] || 0) - (pb[i] || 0); if (diff !== 0) return diff; }
    return 0;
  }
}

export const updateService = new UpdateService();
