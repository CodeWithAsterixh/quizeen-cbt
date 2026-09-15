import { useState, useEffect, useCallback, useRef } from 'react';
import { LicenseState } from '../types/license.js';
import { serverConfig } from './server-config.js';
import { applyThemeCustomization } from '../ui/theme-engine.js';

// Grace period before showing lockout on initial failure.
// Gives UDP discovery time to detect and switch to the real server IP.
const DISCOVERY_GRACE_MS = 6000;

export function useAppLicense() {
  const [licenseState, setLicenseState] = useState<LicenseState | null>(null);
  const [hasResolved, setHasResolved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const graceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchLicense = useCallback(async (isInitial = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await fetch(`${serverConfig.getUrl()}/api/license`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      const state: LicenseState = body?.data || body;
      setLicenseState(state);
      setError(null);
      if (state.license?.theme || state.license?.branding) {
        applyThemeCustomization(state.license.theme, state.license.branding);
      }
      // Cancel any pending grace timer - we have a real result
      if (graceTimerRef.current) { clearTimeout(graceTimerRef.current); graceTimerRef.current = null; }
      setHasResolved(true);
    } catch (err: any) {
      setError(err?.message || 'Server unreachable');
      setLicenseState((prev) => {
        if (prev?.status === 'active' && !isInitial) return prev;
        return {
          status: 'unlicensed',
          hardwareId: 'Server Offline',
          message: 'Central Server is not running or unreachable at ' + serverConfig.getUrl(),
        };
      });
      if (isInitial && !hasResolved) {
        // Don't immediately lock - wait for UDP discovery to auto-switch URL first
        if (!graceTimerRef.current) {
          graceTimerRef.current = setTimeout(() => {
            graceTimerRef.current = null;
            setHasResolved(true);
          }, DISCOVERY_GRACE_MS);
        }
      } else {
        setHasResolved(true);
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, [hasResolved]);

  useEffect(() => {
    fetchLicense(true);
    const handleServerChange = () => fetchLicense(false);
    window.addEventListener('cbt:server-changed', handleServerChange);
    const interval = setInterval(() => fetchLicense(false), 15000);
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
    refreshLicense: () => fetchLicense(false),
    isLocked,
  };
}
