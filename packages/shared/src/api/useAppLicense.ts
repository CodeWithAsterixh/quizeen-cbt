import { useState, useEffect, useRef, useCallback } from 'react';
import { LicenseState } from '../types/license.js';
import { serverConfig } from './server-config.js';
import { applyThemeCustomization } from '../ui/theme-engine.js';

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
      const res = await fetch(`${serverConfig.getUrl()}/api/license`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      const state: LicenseState = body?.data || body;
      setLicenseState({
        ...state,
        serverOnline: true
      });
      setError(null);
      if (state.license?.theme || state.license?.branding) {
        applyThemeCustomization(state.license.theme, state.license.branding);
      }
      if (graceTimerRef.current) { clearTimeout(graceTimerRef.current); graceTimerRef.current = null; }
      hasResolvedRef.current = true;
      setHasResolved(true);
    } catch (err: any) {
      setError(err?.message || 'Server unreachable');
      setLicenseState((prev) => {
        // On background polls, preserve active state so transient errors don't lock screen
        if (prev?.status === 'active' && !isInitial) return prev;
        return {
          status: 'unlicensed',
          hardwareId: 'Server Offline',
          message: 'Central Server is not running or unreachable at ' + serverConfig.getUrl(),
          serverOnline: false
        };
      });
      if (isInitial && !hasResolvedRef.current) {
        // Give UDP discovery time to detect the server and switch the URL
        if (!graceTimerRef.current) {
          graceTimerRef.current = setTimeout(() => {
            graceTimerRef.current = null;
            hasResolvedRef.current = true;
            setHasResolved(true);
          }, DISCOVERY_GRACE_MS);
        }
      } else {
        hasResolvedRef.current = true;
        setHasResolved(true);
      }
    } finally {
      isInitialRef.current = false;
      isFetchingRef.current = false;
    }
  }, []); // stable - no state deps, uses refs instead

  useEffect(() => {
    fetchLicense();
    const handleServerChange = () => { isInitialRef.current = false; fetchLicense(); };
    window.addEventListener('cbt:server-changed', handleServerChange);
    const interval = setInterval(fetchLicense, 15000);
    return () => {
      window.removeEventListener('cbt:server-changed', handleServerChange);
      clearInterval(interval);
      if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    };
  }, [fetchLicense]);

  const isLocked = Boolean(hasResolved && licenseState && licenseState.status !== 'active');

  return {
    licenseState,
    isLoading: !hasResolved,
    error,
    refreshLicense: fetchLicense,
    isLocked,
  };
}
