import React from 'react';
import { ToastItem } from './toast-types.js';
import { toastStore } from './toast-store.js';
import { CheckCircle, WarningCircle, XCircle, X } from './icons.js';

export const ToastItemView: React.FC<{ toast: ToastItem }> = ({ toast }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} weight="fill" color="var(--color-primary, #059669)" />;
      case 'error':
        return <XCircle size={20} weight="fill" color="#ef4444" />;
      case 'warning':
        return <WarningCircle size={20} weight="fill" color="#f59e0b" />;
      case 'info':
      default:
        return <WarningCircle size={20} weight="fill" color="#3b82f6" />;
    }
  };

  return (
    <div
      className={`cbt-toast cbt-toast-${toast.type}`}
      role="status"
      aria-live="polite"
    >
      <div className="cbt-toast-icon">{getIcon()}</div>
      <div className="cbt-toast-content">
        {toast.title && <div className="cbt-toast-title">{toast.title}</div>}
        <div className="cbt-toast-message">{toast.message}</div>
      </div>
      <button
        type="button"
        className="cbt-toast-close"
        onClick={() => toastStore.dismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};
