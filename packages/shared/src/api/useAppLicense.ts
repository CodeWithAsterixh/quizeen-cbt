import { useState, useEffect, useCallback, useRef } from 'react';
import { LicenseState } from '../types/license.js';
import { serverConfig } from './server-config.js';
import { applyThemeCustomization } from '../ui/theme-engine.js';

export function useAppLicense() {
  const [licenseState, setLicenseState] = useState<LicenseState | null>(null);
  const [hasResolved, setHasResolved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

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
    } finally {
      isFetchingRef.current = false;
      setHasResolved(true);
    }
  }, []);

  useEffect(() => {
    fetchLicense(true);
    const handleServerChange = () => fetchLicense(false);
    window.addEventListener('cbt:server-changed', handleServerChange);
    const interval = setInterval(() => fetchLicense(false), 15000);
    return () => {
      window.removeEventListener('cbt:server-changed', handleServerChange);
      clearInterval(interval);
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
