import { DeviceInfo, UpdateCheckResult } from '../types/device.js';
import { serverConfig } from './server-config.js';

export const deviceApi = {
  async reportHeartbeat(device: Partial<DeviceInfo>): Promise<{ success: boolean; pushUpdate?: boolean }> {
    try {
      const res = await fetch(`${serverConfig.getApiBase()}/devices/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        body: JSON.stringify(device),
      });
      if (!res.ok) return { success: false };
      const json = await res.json();
      return { success: true, pushUpdate: Boolean(json.pushUpdate) };
    } catch {
      return { success: false };
    }
  },

  async getConnectedDevices(): Promise<DeviceInfo[]> {
    try {
      const res = await fetch(`${serverConfig.getApiBase()}/devices?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  async pushUpdate(deviceId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${serverConfig.getApiBase()}/devices/${deviceId}/push-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json().catch(() => ({}));
      return { success: res.ok, message: json?.message };
    } catch {
      return { success: false, message: 'Server communication error' };
    }
  },

  async clearOfflineDevices(): Promise<boolean> {
    try {
      const res = await fetch(`${serverConfig.getApiBase()}/devices/offline`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  async checkUpdate(app: string, currentVersion: string): Promise<UpdateCheckResult> {
    try {
      const url = `${serverConfig.getApiBase()}/updates/check?app=${app}&v=${currentVersion}&_t=${Date.now()}`;
      const res = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
      if (!res.ok) return { updateAvailable: false, currentVersion, latestVersion: currentVersion };
      const json = await res.json();
      return json.data || { updateAvailable: false, currentVersion, latestVersion: currentVersion };
    } catch {
      return { updateAvailable: false, currentVersion, latestVersion: currentVersion };
    }
  },

  getDownloadUrl(app: string): string {
    return `${serverConfig.getApiBase()}/updates/download/${app}`;
  },
};
