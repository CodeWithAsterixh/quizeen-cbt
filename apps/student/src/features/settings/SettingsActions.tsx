import React, { useRef } from 'react';
import { FileArchive, Trash } from '@phosphor-icons/react';
import { Button, Badge } from '@cbt/shared';
import { ServerConnectionConfig } from './ServerConnectionConfig';

interface SettingsActionsProps {
  currentExamCount: number;
  isProcessing: boolean;
  onFileSelect: (file: File) => void;
  onClearAll: () => Promise<void>;
  onClose: () => void;
}

export const SettingsActions: React.FC<SettingsActionsProps> = ({
  currentExamCount,
  isProcessing,
  onFileSelect,
  onClearAll,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section aria-label="Test Paper Management">
      <div style={{ background: 'var(--color-surface-hover)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>Test Papers on this Computer:</span>
        <Badge color="emerald">{currentExamCount} Loaded</Badge>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6, color: 'var(--color-text)' }}>Load Assessment Package (.qzn)</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: 14 }}>
          Choose the <code>.qzn</code> package created in the Manager app to add assessments to this computer.
        </p>

        <input
          type="file"
          ref={fileInputRef}
          accept=".qzn,.zip,application/zip,application/x-zip-compressed"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
            if (fileInputRef.current) fileInputRef.current.value = '';
          }}
        />

        <Button
          variant="primary"
          style={{ width: '100%' }}
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          icon={<FileArchive size={20} weight="fill" />}
        >
          {isProcessing ? 'Checking & Unpacking...' : 'Choose .qzn Package to Load'}
        </Button>
      </div>

      <ServerConnectionConfig />

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
        <Button variant="danger" size="sm" onClick={onClearAll} icon={<Trash size={16} />} style={{ width: '100%' }}>
          Delete All Tests on this Station
        </Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 22 }}>
        <Button variant="secondary" onClick={onClose}>Done</Button>
      </div>
    </section>
  );
};
