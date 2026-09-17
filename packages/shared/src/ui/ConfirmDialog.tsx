import React, { useState, useEffect } from 'react';
import { toastStore } from './toast-store.js';
import { ConfirmDialogOptions } from './toast-types.js';
import { Modal } from './Modal.js';
import { Button } from './Button.js';

export const ConfirmDialog: React.FC = () => {
  const [opts, setOpts] = useState<ConfirmDialogOptions | null>(() => toastStore.getConfirm());

  useEffect(() => {
    return toastStore.subscribe(() => {
      setOpts(toastStore.getConfirm());
    });
  }, []);

  if (!opts) return null;

  const handleConfirm = () => {
    const fn = opts.onConfirm;
    toastStore.closeConfirm();
    fn();
  };

  const handleCancel = () => {
    const fn = opts.onCancel;
    toastStore.closeConfirm();
    if (fn) fn();
  };

  const isDanger = opts.variant === 'danger';

  return (
    <Modal
      isOpen={Boolean(opts)}
      onClose={handleCancel}
      title={opts.title}
      maxWidth={440}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, width: '100%' }}>
          <Button variant="outline" size="md" onClick={handleCancel}>
            {opts.cancelLabel || 'Cancel'}
          </Button>
          <Button
            variant={isDanger ? 'primary' : 'primary'}
            size="md"
            onClick={handleConfirm}
            style={isDanger ? { backgroundColor: '#dc2626', borderColor: '#dc2626' } : undefined}
          >
            {opts.confirmLabel || 'Confirm'}
          </Button>
        </div>
      }
    >
      <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted, #4b5563)', lineHeight: 1.5 }}>
        {opts.message}
      </div>
    </Modal>
  );
};
