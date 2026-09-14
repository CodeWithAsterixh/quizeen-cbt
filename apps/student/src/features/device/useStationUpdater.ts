import { useState, useCallback, useEffect } from 'react';
import { deviceApi, UpdatePhase } from '@cbt/shared';

export const useStationUpdater = (isExamActive: boolean) => {
  const [phase, setPhase] = useState<UpdatePhase>('idle');
  const [progress, setProgress] = useState(0);
  const [latestVersion, setLatestVersion] = useState('1.2.0');
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdate = useCallback(async () => {
    try {
      setPhase('checking');
      const res = await deviceApi.checkUpdate('student', '1.2.0');
      if (res.updateAvailable) {
        setLatestVersion(res.latestVersion);
        setPendingUpdate(true);
        if (!isExamActive) {
          setShowModal(true);
        }
      }
      setPhase('idle');
    } catch {
      setPhase('idle');
    }
  }, [isExamActive]);

  useEffect(() => {
    if (!isExamActive && pendingUpdate && phase === 'idle') {
      setShowModal(true);
    }
  }, [isExamActive, pendingUpdate, phase]);

  const startDownload = useCallback(async () => {
    if (isExamActive) return;
    setError(null);
    setPhase('downloading');
    setProgress(0);
    try {
      const url = deviceApi.getDownloadUrl('student');
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
  }, [isExamActive]);

  const dismissModal = () => {
    setShowModal(false);
  };

  return {
    phase,
    progress,
    latestVersion,
    showModal,
    error,
    checkForUpdate,
    startDownload,
    dismissModal,
  };
};
