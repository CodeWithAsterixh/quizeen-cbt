import { useState, useEffect, useCallback } from 'react';

export function useTitleBar() {
  const isElectron = typeof window !== 'undefined' && Boolean(window.electronApi);
  const [isMax, setIsMax] = useState(false);

  const checkMaximized = useCallback(() => {
    if (isElectron && window.electronApi?.isMaximized) {
      window.electronApi.isMaximized().then((max) => setIsMax(Boolean(max)));
    }
  }, [isElectron]);

  useEffect(() => {
    if (isElectron) {
      document.documentElement.style.setProperty('--titlebar-height', '34px');
      checkMaximized();
      const unsubscribe = window.electronApi?.onMaximizeChange?.((max) => setIsMax(Boolean(max)));
      return () => {
        unsubscribe?.();
      };
    } else {
      document.documentElement.style.setProperty('--titlebar-height', '0px');
    }
  }, [isElectron, checkMaximized]);

  const handleMinimize = useCallback(() => {
    window.electronApi?.minimizeWindow?.();
  }, []);

  const handleMaximize = useCallback(async () => {
    const next = await window.electronApi?.maximizeWindow?.();
    setIsMax(Boolean(next));
  }, []);

  const handleClose = useCallback(() => {
    window.electronApi?.closeWindow?.();
  }, []);

  return { isElectron, isMax, handleMinimize, handleMaximize, handleClose };
}
