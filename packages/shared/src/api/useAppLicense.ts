import { useState, useEffect, useRef, useCallback } from 'react';
import { LicenseState } from '../types/license.js';
import { serverConfig } from './server-config.js';
import { socketClient } from './socket-client.js';
import { applyThemeCustomization } from '../ui/theme-engine.js';
import { bakedWhitelabelConfig } from '../whitelabel-data.js';

// On first load, if the server is unreachable (e.g. client is on a different
// machine and still pointing at localhost), hold off showing the lockout screen
// for this long. UDP discovery will auto-switch the URL during this window.
const DISCOVERY_GRACE_MS = 8000;

export function useAppLicense() {
  const [licenseState, setLicenseState] = useState<LicenseState | null>(null);
  const [hasResolved, setHasResolved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const graceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Use a ref to track initial load without it becoming a dep of fetchLicense
  const isInitialRef = useRef(true);
  const hasResolvedRef = useRef(false);

  const fetchLicense = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    const isInitial = isInitialRef.current;
    try {
      const res = await fetch(`${serverConfig.getUrl()}/api/license`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      const state: LicenseState = body?.data || body;
      setLicenseState({ ...state, serverOnline: true });
      setError(null);
      if (state.license?.theme || state.license?.branding) {
        const b = state.license.branding ? { ...state.license.branding } : undefined;
        if (b) {
          const s = serverConfig.getUrl();
          if (b.appIconUrl?.startsWith('/')) b.appIconUrl = `${s}${b.appIconUrl}`;
          if (b.logoUrl?.startsWith('/')) b.logoUrl = `${s}${b.logoUrl}`;
        }
        applyThemeCustomization(state.license.theme, b);
        if (b && typeof window !== 'undefined') (window as any).electronApi?.applyBranding?.(b);
      }
      if (graceTimerRef.current) { clearTimeout(graceTimerRef.current); graceTimerRef.current = null; }
      hasResolvedRef.current = true;
      setHasResolved(true);
    } catch (err: any) {
      setError(err?.message || 'Server unreachable');
      setLicenseState((prev) => {
        if (prev?.status === 'active' && !isInitial) return prev;
        const s = bakedWhitelabelConfig?.unlicensedMode ? 'active' : 'unlicensed';
        return { status: s, hardwareId: 'Server Offline', message: 'Server unreachable at ' + serverConfig.getUrl(), serverOnline: false };
      });
      if (isInitial && !hasResolvedRef.current) {
        if (!graceTimerRef.current) {
          graceTimerRef.current = setTimeout(() => { graceTimerRef.current = null; hasResolvedRef.current = true; setHasResolved(true); }, DISCOVERY_GRACE_MS);
        }
      } else {
        hasResolvedRef.current = true;
        setHasResolved(true);
      }
    } finally {
      isInitialRef.current = false;
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (bakedWhitelabelConfig?.isWhitelabel && (bakedWhitelabelConfig.primaryColor || bakedWhitelabelConfig.accentColor)) {
      applyThemeCustomization({ primaryColor: bakedWhitelabelConfig.primaryColor, accentColor: bakedWhitelabelConfig.accentColor });
    }
    fetchLicense();
    const handleServerChange = () => { isInitialRef.current = false; fetchLicense(); };
    window.addEventListener('cbt:server-changed', handleServerChange);
    const unsubLicense = socketClient.on('license:changed', fetchLicense);
    const unsubTheme = socketClient.on('theme:changed', (t: any) => { if (t) applyThemeCustomization(t); });
    const unsubConn = socketClient.onConnectionChange((connected) => { if (connected) fetchLicense(); });
    return () => {
      window.removeEventListener('cbt:server-changed', handleServerChange);
      unsubLicense();
      unsubTheme();
      unsubConn();
      if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    };
  }, [fetchLicense]);

  const isLocked = Boolean(!bakedWhitelabelConfig?.unlicensedMode && hasResolved && licenseState && licenseState.status !== 'active');

  return {
    licenseState,
    isLoading: !hasResolved,
    error,
    refreshLicense: fetchLicense,
    isLocked,
  };
}
