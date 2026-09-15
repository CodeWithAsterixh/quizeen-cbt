import { useState, useEffect, useCallback } from 'react';
import { LicenseState } from '../types/license.js';
import { serverConfig } from './server-config.js';
import { applyThemeCustomization } from '../ui/theme-engine.js';

export function useAppLicense() {
  const [licenseState, setLicenseState] = useState<LicenseState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLicense = useCallback(async () => {
    try {
      setIsLoading(true);
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
      setLicenseState({
        status: 'unlicensed',
        hardwareId: 'Server Offline',
        message: 'Central Server is not running or unreachable at ' + serverConfig.getUrl(),
      });
      setError(err?.message || 'Server unreachable');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLicense();
    const handleServerChange = () => fetchLicense();
    window.addEventListener('cbt:server-changed', handleServerChange);
    const interval = setInterval(fetchLicense, 15000);
    return () => {
      window.removeEventListener('cbt:server-changed', handleServerChange);
      clearInterval(interval);
    };
  }, [fetchLicense]);

  const isLocked = isLoading ? true : licenseState?.status !== 'active';

  return {
    licenseState,
    isLoading,
    error,
    refreshLicense: fetchLicense,
    isLocked,
  };
}
