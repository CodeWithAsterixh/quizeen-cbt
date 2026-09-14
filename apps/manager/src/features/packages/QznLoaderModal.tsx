import React, { useState, useRef } from 'react';
import { Modal, Button, Badge, FileArchive, UploadSimple, CheckCircle, Assessment } from '@cbt/shared';
import { unpackExamZip } from '@cbt/shared';

interface QznLoaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (exams: Assessment[]) => Promise<void>;
}

export const QznLoaderModal: React.FC<QznLoaderModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setStatus(null);
    try {
      const buffer = await file.arrayBuffer();
      const result = await unpackExamZip(buffer);
      if (result.success && result.exams) {
        const normalized = result.exams.map((e) => ({
          ...e,
          isPublished: e.isPublished ?? true,
          isAvailable: e.isAvailable ?? true,
        }));
        await onImport(normalized);
        setStatus({
          type: 'success',
          message: `Successfully loaded ${normalized.length} assessment(s) from "${result.manifest?.packageName || file.name}".`,
        });
      } else {
        setStatus({ type: 'error', message: result.message || 'Failed to verify package contents.' });
      }
    } catch (err: unknown) {
      setStatus({ type: 'error', message: (err as Error).message || 'Failed to load .qzn package.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStatus(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Load Assessment Package (.qzn)" subtitle="Import assessments created on another workstation" maxWidth={560}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {status && (
          <Badge color={status.type === 'success' ? 'emerald' : 'rose'} icon={status.type === 'success' ? <CheckCircle size={16} /> : undefined}>
            {status.message}
          </Badge>
        )}

        <div style={{ border: '2px dashed var(--color-border)', borderRadius: 10, padding: '28px 20px', textAlign: 'center', background: 'var(--color-bg-subtle, #f8fafc)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <FileArchive size={42} color="var(--color-primary)" weight="duotone" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>Select a .qzn Package File</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 4 }}>Load offline tests from a flash drive or backup directory</div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept=".qzn,.zip,application/zip"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          />
          <Button
            type="button"
            variant="primary"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
            icon={<UploadSimple size={18} weight="bold" />}
          >
            {isProcessing ? 'Unpacking Package...' : 'Choose .qzn Package'}
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 6 }}>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
