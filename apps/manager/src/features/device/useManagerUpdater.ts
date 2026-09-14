import { useState, useCallback, useEffect } from 'react';
import { deviceApi, UpdatePhase } from '@cbt/shared';

export const useManagerUpdater = (isBusyAuthoring: boolean) => {
  const [phase, setPhase] = useState<UpdatePhase>('idle');
  const [progress, setProgress] = useState(0);
  const [latestVersion, setLatestVersion] = useState('1.2.0');
  const [hasUpdate, setHasUpdate] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdate = useCallback(async () => {
    try {
      setPhase('checking');
      const res = await deviceApi.checkUpdate('manager', '1.2.0');
      if (res.updateAvailable) {
        setLatestVersion(res.latestVersion);
        setHasUpdate(true);
        setBannerVisible(true);
      }
      setPhase('idle');
    } catch {
      setPhase('idle');
    }
  }, []);

  useEffect(() => {
    checkForUpdate();
    const interval = setInterval(checkForUpdate, 60000);
    return () => clearInterval(interval);
  }, [checkForUpdate]);

  const startDownload = useCallback(async () => {
    if (isBusyAuthoring) return;
    setError(null);
    setPhase('downloading');
    setProgress(0);
    try {
      const url = deviceApi.getDownloadUrl('manager');
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed from central server');
      const total = Number(response.headers.get('Content-Length')) || 0;
      const reader = response.body?.getReader();
      let loaded = 0;
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          loaded += value?.length || 0;
          if (total > 0) setProgress(Math.round((loaded / total) * 100));
        }
      }
      setPhase('installing');
      setProgress(100);
      setTimeout(() => setPhase('ready'), 2000);
    } catch (err: any) {
      setError(err?.message || 'Update failed');
      setPhase('failed');
    }
  }, [isBusyAuthoring]);

  return {
    phase,
    progress,
    latestVersion,
    hasUpdate,
    bannerVisible,
    error,
    checkForUpdate,
    startDownload,
    dismissBanner: () => setBannerVisible(false),
  };
};
