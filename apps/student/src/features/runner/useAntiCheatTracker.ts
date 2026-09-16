import { useEffect, useRef, useCallback } from 'react';

// On focus loss: auto-submit the exam immediately rather than warning.
// The kiosk lock (setAlwaysOnTop + fullscreen) already prevents most exits,
// but if focus somehow escapes, we treat that as the student leaving and
// force-submit so there is no ambiguity about whether the attempt counts.
export function useAntiCheatTracker(onAutoSubmit?: () => void) {
  const cbRef = useRef(onAutoSubmit);
  cbRef.current = onAutoSubmit;

  const triggerSubmit = useCallback(() => {
    cbRef.current?.();
  }, []);

  useEffect(() => {
    const electron = (window as any).electronApi;
    electron?.enterExamMode?.();

    const handleVisibility = () => {
      if (document.hidden) triggerSubmit();
    };
    const handleBlur = () => {
      triggerSubmit();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      electron?.exitExamMode?.();
    };
  }, [triggerSubmit]);
}
