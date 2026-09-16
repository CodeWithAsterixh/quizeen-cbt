import { useState, useCallback, useEffect } from 'react';
import { deviceApi, UpdatePhase, getAppVersion, socketClient } from '@cbt/shared';

export const useManagerUpdater = (isBusyAuthoring: boolean) => {
  const [phase, setPhase] = useState<UpdatePhase>('idle');
  const [progress, setProgress] = useState(0);
  const [latestVersion, setLatestVersion] = useState(getAppVersion());
  const [hasUpdate, setHasUpdate] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdate = useCallback(async () => {
    try {
      setPhase('checking');
      const res = await deviceApi.checkUpdate('manager', getAppVersion());
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
    return socketClient.on('updates:available', (data) => {
      if (!data?.app || data.app === 'manager') checkForUpdate();
    });
  }, [checkForUpdate]);

  const startDownload = useCallback(async () => {
    if (isBusyAuthoring) return;
    setError(null);
    setPhase('downloading');
    setProgress(0);
    try {
      const url = deviceApi.getDownloadUrl('manager');
      const response = await fetch(url);
      if (!response.ok) {
        let msg = 'No update package staged on central server';
        try {
          const errJson = await response.json();
          if (errJson?.message) msg = errJson.message;
        } catch {}
        throw new Error(msg);
      }
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
