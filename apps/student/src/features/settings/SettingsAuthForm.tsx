import React, { useState } from 'react';
import { Key } from '@phosphor-icons/react';
import { Button, TextInput } from '@cbt/shared';

interface SettingsAuthFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const MASTER_PASSWORD = (import.meta as any).env?.VITE_ADMIN_PASSWORD || 'admin123';

export const SettingsAuthForm: React.FC<SettingsAuthFormProps> = ({ onSuccess, onCancel }) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === MASTER_PASSWORD.trim()) {
      onSuccess();
    } else {
      setErrorMsg('Incorrect password. Please consult the exam supervisor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Teacher security check">
      <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: 18, lineHeight: 1.5 }}>
        This area is for teachers and exam hall supervisors. Please enter the master password to manage test papers.
      </p>

      <TextInput
        type="password"
        label="Teacher Master Password"
        placeholder="Enter supervisor password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        icon={<Key size={18} />}
        error={errorMsg}
        autoFocus
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Unlock Settings
        </Button>
      </div>
    </form>
  );
};
