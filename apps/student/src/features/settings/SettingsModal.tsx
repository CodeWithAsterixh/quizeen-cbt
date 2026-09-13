import React, { useState } from 'react';
import { Lock } from '@phosphor-icons/react';
import { unpackExamZip, Exam, Modal, Badge } from '@cbt/shared';
import { SettingsAuthForm } from './SettingsAuthForm';
import { SettingsActions } from './SettingsActions';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamsUpdated: (exams: Exam[]) => void;
  currentExamCount: number;
  onResetToDefaults: () => Promise<void>;
  onClearAll: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onExamsUpdated,
  currentExamCount,
  onResetToDefaults,
  onClearAll,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setStatusMsg(null);
    try {
      const buffer = await file.arrayBuffer();
      const result = await unpackExamZip(buffer);
      if (result.success && result.exams) {
        setStatusMsg({ type: 'success', text: `Loaded ${result.exams.length} test papers from "${result.manifest?.packageName}".` });
        onExamsUpdated(result.exams);
      } else {
        setStatusMsg({ type: 'error', text: result.message });
      }
    } catch (err: unknown) {
      setStatusMsg({ type: 'error', text: `Failed to load file: ${err instanceof Error ? err.message : 'Error'}` });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsAuthenticated(false);
    setStatusMsg(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Teacher & Supervisor Tools"
    >
      {statusMsg && (
        <div style={{ marginBottom: 16 }}>
          <Badge color={statusMsg.type === 'success' ? 'emerald' : 'rose'}>
            {statusMsg.text}
          </Badge>
        </div>
      )}

      {!isAuthenticated ? (
        <SettingsAuthForm onSuccess={() => setIsAuthenticated(true)} onCancel={handleClose} />
      ) : (
        <SettingsActions
          currentExamCount={currentExamCount}
          isProcessing={isProcessing}
          onFileSelect={handleFileSelect}
          onResetToDefaults={onResetToDefaults}
          onClearAll={onClearAll}
          onClose={handleClose}
        />
      )}
    </Modal>
  );
};
