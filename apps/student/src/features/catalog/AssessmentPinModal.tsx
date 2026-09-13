import React, { useState } from 'react';
import { LockKey, Play } from '@phosphor-icons/react';
import { Assessment, Exam, Modal, Button, TextInput } from '@cbt/shared';

interface AssessmentPinModalProps {
  assessment: Assessment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AssessmentPinModal: React.FC<AssessmentPinModalProps> = ({
  assessment,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const exam = assessment;
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !exam) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam.unlockPin || exam.unlockPin.trim() === '') {
      onConfirm();
      return;
    }
    if (pinInput.trim() === exam.unlockPin.trim()) {
      setErrorMsg('');
      setPinInput('');
      onConfirm();
      onClose();
    } else {
      setErrorMsg('Incorrect PIN. Please raise your hand and ask your teacher.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter Test PIN"
      maxWidth={460}
    >
      <form onSubmit={handleSubmit} aria-label="Enter test unlock PIN">
        <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: 14 }}>
          This test requires a 4-digit start PIN. Ask your teacher or supervisor for the code.
        </p>

        <TextInput
          label="4-Digit Exam PIN"
          type="password"
          maxLength={6}
          placeholder="••••"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          error={errorMsg}
          style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px', fontWeight: 800 }}
          autoFocus
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={<Play size={16} weight="fill" />}>
            Unlock & Begin
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export const ExamPinModal = AssessmentPinModal;
