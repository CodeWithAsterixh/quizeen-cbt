import { ThemeConfig } from '../types/license.js';
import { serverConfig } from './server-config.js';

export const themeApi = {
  async getTheme(): Promise<ThemeConfig | null> {
    try {
      const res = await fetch(`${serverConfig.getUrl()}/api/theme`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  async saveTheme(theme: Partial<ThemeConfig>): Promise<{ success: boolean; data?: ThemeConfig; error?: string }> {
    try {
      const res = await fetch(`${serverConfig.getUrl()}/api/theme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });
      const json = await res.json();
      return { success: json.success ?? res.ok, data: json.data, error: json.error };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Could not connect to server' };
    }
  },
};
