import React from 'react';
import { WarningCircle, DoorOpen } from '@phosphor-icons/react';
import { Modal, Button, Badge } from '@cbt/shared';

interface RunnerModalsProps {
  isSubmitOpen: boolean;
  isQuitOpen: boolean;
  unansweredCount: number;
  isSubmitting: boolean;
  onCloseSubmit: () => void;
  onConfirmSubmit: () => void;
  onCloseQuit: () => void;
  onConfirmQuit: () => void;
}

export const RunnerModals: React.FC<RunnerModalsProps> = ({
  isSubmitOpen,
  isQuitOpen,
  unansweredCount,
  isSubmitting,
  onCloseSubmit,
  onConfirmSubmit,
  onCloseQuit,
  onConfirmQuit,
}) => {
  return (
    <>
      <Modal isOpen={isSubmitOpen} onClose={onCloseSubmit} title="Submit Your Assessment?" maxWidth={480}>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: 14 }}>
          Are you ready to finish and submit your answers to your teacher?
        </p>

        {unansweredCount > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Badge color="amber" icon={<WarningCircle size={18} />}>
              You still have {unansweredCount} question(s) left unanswered!
            </Badge>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <Button variant="secondary" onClick={onCloseSubmit} disabled={isSubmitting}>
            Review Answers
          </Button>
          <Button variant="danger" onClick={onConfirmQuit} disabled={isSubmitting}>
            Exit
          </Button>
          <Button variant="success" onClick={onConfirmSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={isQuitOpen} onClose={onCloseQuit} title="Leave Assessment?" maxWidth={450}>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: 18 }}>
          If you leave now, this attempt will be closed without being marked. Are you sure you want to stop?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="secondary" onClick={onCloseQuit}>Stay on Assessment</Button>
          <Button variant="danger" onClick={onConfirmQuit}>Exit Assessment</Button>
        </div>
      </Modal>
    </>
  );
};
