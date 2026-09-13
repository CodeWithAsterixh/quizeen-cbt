const DEFAULT_URL = 'http://localhost:4000';

function getStoredUrl(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = window.localStorage.getItem('cbt_server_url');
    if (saved) return saved.replace(/\/+$/, '');
  }
  return DEFAULT_URL;
}

let activeUrl = getStoredUrl();

export const serverConfig = {
  getUrl: (): string => activeUrl,
  getApiBase: (): string => `${activeUrl}/api`,
  setUrl: (url: string): void => {
    activeUrl = url.replace(/\/+$/, '');
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('cbt_server_url', activeUrl);
    }
  },
  testConnection: async (url?: string): Promise<{ ok: boolean; latencyMs: number }> => {
    const base = (url || activeUrl).replace(/\/+$/, '');
    const start = Date.now();
    try {
      const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(2000) });
      return { ok: res.ok, latencyMs: Date.now() - start };
    } catch {
      return { ok: false, latencyMs: Date.now() - start };
    }
  },
};
