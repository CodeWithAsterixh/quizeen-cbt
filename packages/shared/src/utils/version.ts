export const APP_VERSION = '2.1.0';

export function getAppVersion(): string {
  if (typeof window !== 'undefined') {
    const electronVer = (window as any).electronApi?.appVersion;
    if (typeof electronVer === 'string' && electronVer.trim()) {
      return electronVer.trim();
    }
  }
  return APP_VERSION;
}
