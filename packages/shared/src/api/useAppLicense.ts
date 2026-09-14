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
      const data: LicenseState = await res.json();
      setLicenseState(data);
      setError(null);
      if (data.license?.theme || data.license?.branding) {
        applyThemeCustomization(data.license.theme, data.license.branding);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check license');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLicense();
    const handleServerChange = () => fetchLicense();
    window.addEventListener('cbt:server-changed', handleServerChange);
    const interval = setInterval(fetchLicense, 60000);
    return () => {
      window.removeEventListener('cbt:server-changed', handleServerChange);
      clearInterval(interval);
    };
  }, [fetchLicense]);

  return {
    licenseState,
    isLoading,
    error,
    refreshLicense: fetchLicense,
    isLocked: licenseState ? licenseState.status !== 'active' : false,
  };
}
