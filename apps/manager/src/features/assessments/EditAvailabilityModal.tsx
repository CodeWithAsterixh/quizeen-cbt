import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput, CheckCircle, XCircle } from '@cbt/shared';

interface Props {
  isOpen: boolean;
  isAvailable: boolean;
  availableFrom: string;
  availableTo: string;
  onClose: () => void;
  onSave: (data: { isAvailable: boolean; availableFrom: string; availableTo: string }) => void;
}

export const EditAvailabilityModal: React.FC<Props> = ({
  isOpen, isAvailable: initAvailable, availableFrom: initFrom, availableTo: initTo, onClose, onSave,
}) => {
  const [isAvailable, setIsAvailable] = useState(initAvailable);
  const [availableFrom, setAvailableFrom] = useState(initFrom);
  const [availableTo, setAvailableTo] = useState(initTo);

  useEffect(() => {
    if (isOpen) {
      setIsAvailable(initAvailable);
      setAvailableFrom(initFrom);
      setAvailableTo(initTo);
    }
  }, [isOpen, initAvailable, initFrom, initTo]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ isAvailable, availableFrom, availableTo });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Assessment Availability & Schedule" maxWidth={500}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
            Current Status
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button
              type="button"
              variant={isAvailable ? 'primary' : 'outline'}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAvailable(true); }}
              icon={<CheckCircle size={16} weight="bold" />}
            >
              Available (Active)
            </Button>
            <Button
              type="button"
              variant={!isAvailable ? 'danger' : 'outline'}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAvailable(false); }}
              icon={<XCircle size={16} weight="bold" />}
            >
              Unavailable (Hidden)
            </Button>
          </div>
        </div>

        <TextInput
          type="datetime-local"
          label="Available From (Optional)"
          value={availableFrom}
          onChange={(e) => setAvailableFrom(e.target.value)}
          helperText="Students cannot open before this time"
        />

        <TextInput
          type="datetime-local"
          label="Available Until (Optional)"
          value={availableTo}
          onChange={(e) => setAvailableTo(e.target.value)}
          helperText="Assessment closes after this time"
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <Button type="button" variant="secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}>Cancel</Button>
          <Button type="button" variant="primary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSave(); }}>Save Availability</Button>
        </div>
      </div>
    </Modal>
  );
};
