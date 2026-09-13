import { useState, useEffect } from 'react';

export function useAntiCheatTracker() {
  const [infractionCount, setInfractionCount] = useState(0);
  const [warningBanner, setWarningBanner] = useState('');

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setInfractionCount((c) => c + 1);
        setWarningBanner('Security Warning: Tab switching and leaving test window is prohibited.');
        setTimeout(() => setWarningBanner(''), 5000);
      }
    };

    const handleBlur = () => {
      setInfractionCount((c) => c + 1);
      setWarningBanner('Notice: Window focus lost. Focus on your exam.');
      setTimeout(() => setWarningBanner(''), 4000);
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
