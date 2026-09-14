import React from 'react';
import { Modal, Button, WarningCircle } from '@cbt/shared';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CloseWarningModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Stop Server & Exit?" maxWidth={480}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#fef2f2', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid #fecaca' }}>
          <WarningCircle size={26} weight="fill" color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: '0.875rem', color: '#991b1b', lineHeight: 1.45 }}>
            <strong>The CBT server is currently active.</strong> Closing this application will terminate all network services and disconnect active candidate exam terminals.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
          <Button variant="secondary" onClick={onClose}>Keep Server Running</Button>
          <Button variant="danger" onClick={onConfirm}>Stop Server & Exit</Button>
        </div>
      </div>
    </Modal>
  );
};
