import { useState, useEffect, useRef } from 'react';

export function useAntiCheatTracker(onInfraction?: (count: number) => void) {
  const [infractionCount, setInfractionCount] = useState(0);
  const [warningBanner, setWarningBanner] = useState('');
  const cbRef = useRef(onInfraction);
  cbRef.current = onInfraction;

  useEffect(() => {
    const recordInfraction = (msg: string) => {
      setInfractionCount((c) => {
        const next = c + 1;
        cbRef.current?.(next);
        return next;
      });
      setWarningBanner(msg);
      setTimeout(() => setWarningBanner(''), 4500);
    };

    const handleVisibility = () => {
      if (document.hidden) recordInfraction('Security Warning: Tab switching and leaving test window is prohibited.');
    };
    const handleBlur = () => {
      recordInfraction('Notice: Window focus lost. Focus on your exam.');
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return { infractionCount, warningBanner };
}
