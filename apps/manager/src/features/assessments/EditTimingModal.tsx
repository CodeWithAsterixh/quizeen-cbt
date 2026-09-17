import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput, NumberInput, SelectDropdown, AssessmentType, SubjectInput } from '@cbt/shared';

interface Props {
  isOpen: boolean;
  subject: string;
  session: string;
  assessmentType: AssessmentType;
  durationMinutes: number;
  passingScore: number;
  onClose: () => void;
  onSave: (data: { subject: string; session: string; assessmentType: AssessmentType; durationMinutes: number; passingScore: number }) => void;
}

export const EditTimingModal: React.FC<Props> = ({
  isOpen, subject: initSub, session: initSes, assessmentType: initType,
  durationMinutes: initDur, passingScore: initPass, onClose, onSave,
}) => {
  const [subject, setSubject] = useState(initSub);
  const [session, setSession] = useState(initSes);
  const [type, setType] = useState<AssessmentType>(initType);
  const [duration, setDuration] = useState(initDur);
  const [passing, setPassing] = useState(initPass);

  useEffect(() => {
    if (isOpen) {
      setSubject(initSub);
      setSession(initSes);
      setType(initType);
      setDuration(initDur);
      setPassing(initPass);
    }
  }, [isOpen, initSub, initSes, initType, initDur, initPass]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ subject, session, assessmentType: type, durationMinutes: duration, passingScore: passing });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Assessment Details & Timing" maxWidth={500}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SubjectInput label="Subject Name" value={subject} onChangeValue={setSubject} required />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <TextInput label="Academic Session" value={session} onChange={(e) => setSession(e.target.value)} placeholder="e.g. 2025/2026" />
          <SelectDropdown
            label="Type"
            value={type}
            options={[{ value: 'test', label: 'Test' }, { value: 'exam', label: 'Exam' }]}
            onChange={(v) => setType(v as AssessmentType)}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <NumberInput label="Duration (Minutes)" value={duration} min={1} max={300} onChange={(v) => setDuration(v)} />
          <NumberInput label="Pass Score (%)" value={passing} min={0} max={100} onChange={(v) => setPassing(v)} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button type="button" variant="secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}>Cancel</Button>
          <Button type="button" variant="primary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSave(); }}>Save Timing</Button>
        </div>
      </div>
    </Modal>
  );
};
