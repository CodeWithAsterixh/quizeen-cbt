import React, { useEffect } from 'react';
import { ToastContainer } from './ToastContainer.js';
import { ConfirmDialog } from './ConfirmDialog.js';
import { PromptDialog } from './PromptDialog.js';
import { toast, dialog } from './toast-store.js';

export const GlobalDialogHost: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;

    window.alert = (message?: any) => {
      const msg = String(message ?? '');
      toast.info(msg);
    };

    window.confirm = (message?: string) => {
      dialog.confirm({
        title: 'Confirmation',
        message: message || 'Please confirm this action.',
        onConfirm: () => {},
      });
      return false;
    };

    window.prompt = (message?: string, _default?: string) => {
      dialog.prompt({
        title: 'Input Required',
        message: message || 'Please enter a value.',
        defaultValue: _default,
        onConfirm: () => {},
      });
      return null;
    };

    return () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      window.prompt = originalPrompt;
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <ConfirmDialog />
      <PromptDialog />
    </>
  );
};
