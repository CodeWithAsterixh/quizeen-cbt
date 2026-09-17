import React, { useState, useEffect } from 'react';
import { toastStore } from './toast-store.js';
import { PromptDialogOptions } from './toast-types.js';
import { Modal } from './Modal.js';
import { Button } from './Button.js';
import { TextInput } from './TextInput.js';

export const PromptDialog: React.FC = () => {
  const [opts, setOpts] = useState<PromptDialogOptions | null>(() => toastStore.getPrompt());
  const [value, setValue] = useState('');

  useEffect(() => {
    return toastStore.subscribe(() => {
      const cur = toastStore.getPrompt();
      setOpts(cur);
      if (cur) setValue(cur.defaultValue || '');
    });
  }, []);

  if (!opts) return null;

  const handleConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fn = opts.onConfirm;
    toastStore.closePrompt();
    fn(value);
  };

  const handleCancel = () => {
    const fn = opts.onCancel;
    toastStore.closePrompt();
    if (fn) fn();
  };

  return (
    <Modal
      isOpen={Boolean(opts)}
      onClose={handleCancel}
      title={opts.title}
      maxWidth={460}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, width: '100%' }}>
          <Button variant="outline" size="md" onClick={handleCancel}>
            {opts.cancelLabel || 'Cancel'}
          </Button>
          <Button variant="primary" size="md" onClick={() => handleConfirm()}>
            {opts.confirmLabel || 'Submit'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-muted, #4b5563)' }}>
          {opts.message}
        </p>
        <TextInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={opts.placeholder}
          autoFocus
        />
      </form>
    </Modal>
  );
};
