import React from 'react';
import { Modal, Button, X } from '@cbt/shared';

interface Props {
  isOpen: boolean;
  imageUrl?: string;
  caption?: string;
  onClose: () => void;
}

export const ImageZoomModal: React.FC<Props> = ({ isOpen, imageUrl, caption, onClose }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={caption || 'Diagram Inspection'} maxWidth={900}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '10px 0' }}>
        <div style={{ maxHeight: '72vh', overflow: 'auto', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <img
            src={imageUrl}
            alt={caption || 'Question Diagram'}
            style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 6 }}
          />
        </div>
        {caption && (
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
            {caption}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: 8 }}>
          <Button variant="secondary" onClick={onClose} icon={<X size={16} />}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
