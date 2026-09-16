import React, { useState, useEffect } from 'react';
import { Modal, Button, CheckCircle, XCircle, TextInput } from '@cbt/shared';

interface Props {
  isOpen: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  unlockPin?: string;
  onClose: () => void;
  onSave: (data: { shuffleQuestions: boolean; shuffleOptions: boolean; unlockPin?: string }) => void;
}

export const EditShufflingModal: React.FC<Props> = ({
  isOpen, shuffleQuestions: initQ, shuffleOptions: initOpt, unlockPin: initPin, onClose, onSave,
}) => {
  const [shuffleQuestions, setShuffleQuestions] = useState(initQ);
  const [shuffleOptions, setShuffleOptions] = useState(initOpt);
  const [pin, setPin] = useState(initPin || '');

  useEffect(() => {
    if (isOpen) {
      setShuffleQuestions(initQ);
      setShuffleOptions(initOpt);
      setPin(initPin || '');
    }
  }, [isOpen, initQ, initOpt, initPin]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ shuffleQuestions, shuffleOptions, unlockPin: pin.trim() || undefined });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Shuffling & Security Settings" maxWidth={480}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)' }}>
          <span style={{ fontWeight: 600 }}>Shuffle Questions Order</span>
          <Button
            type="button" size="sm" variant={shuffleQuestions ? 'primary' : 'outline'}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShuffleQuestions(!shuffleQuestions); }}
            icon={shuffleQuestions ? <CheckCircle size={16} weight="bold" /> : <XCircle size={16} weight="bold" />}
          >
            {shuffleQuestions ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border)' }}>
          <span style={{ fontWeight: 600 }}>Shuffle Answer Options</span>
          <Button
            type="button" size="sm" variant={shuffleOptions ? 'primary' : 'outline'}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShuffleOptions(!shuffleOptions); }}
            icon={shuffleOptions ? <CheckCircle size={16} weight="bold" /> : <XCircle size={16} weight="bold" />}
          >
            {shuffleOptions ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        <TextInput
          label="Unlock PIN (Optional)"
          placeholder="e.g. 1234"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          helperText="Requires students to enter PIN before commencing test"
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button type="button" variant="secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}>Cancel</Button>
          <Button type="button" variant="primary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSave(); }}>Save Security</Button>
        </div>
      </div>
    </Modal>
  );
};
