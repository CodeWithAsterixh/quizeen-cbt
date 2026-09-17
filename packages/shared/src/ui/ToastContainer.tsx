import React, { useState, useEffect } from 'react';
import { toastStore } from './toast-store.js';
import { ToastItem } from './toast-types.js';
import { ToastItemView } from './ToastItemView.js';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>(() => toastStore.getToasts());

  useEffect(() => {
    return toastStore.subscribe(() => {
      setToasts([...toastStore.getToasts()]);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="cbt-toast-container" aria-label="Notifications">
      {toasts.map((t) => (
        <ToastItemView key={t.id} toast={t} />
      ))}
    </div>
  );
};
