const DEFAULT_URL = 'http://localhost:4000';

function getStoredUrl(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem('cbt_server_url');
    if (saved) return saved.replace(/\/+$/, '');
  }
  return DEFAULT_URL;
}

let activeUrl = getStoredUrl();
let lastCheckTime = 0;
let lastCheckResult: { ok: boolean; latencyMs: number } | null = null;

export const serverConfig = {
  getUrl: (): string => activeUrl,
  getApiBase: (): string => `${activeUrl}/api`,
  setUrl: (url: string): void => {
    activeUrl = url.replace(/\/+$/, '');
    lastCheckTime = 0;
    lastCheckResult = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('cbt_server_url', activeUrl);
    }
  },
  testConnection: async (url?: string, forceRefresh = false): Promise<{ ok: boolean; latencyMs: number }> => {
    const now = Date.now();
    if (!url && !forceRefresh && lastCheckResult && now - lastCheckTime < 3500) {
      return lastCheckResult;
    }
    const base = (url || activeUrl).replace(/\/+$/, '');
    const start = Date.now();
    try {
      const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(2000) });
      const result = { ok: res.ok, latencyMs: Date.now() - start };
      if (!url) {
        lastCheckTime = now;
        lastCheckResult = result;
      }
      return result;
    } catch {
      const result = { ok: false, latencyMs: Date.now() - start };
      if (!url) {
        lastCheckTime = now;
        lastCheckResult = result;
      }
      return result;
    }
  },
};
