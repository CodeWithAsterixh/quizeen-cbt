import React, { useState, useEffect } from 'react';
import { Modal, Button, NumberInput, SelectDropdown, AssessmentType, SubjectInput, AcademicSessionInput, ASSESSMENT_TYPES } from '@cbt/shared';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Assessment Details & Timing"
      maxWidth={580}
      minHeight={470}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, width: '100%' }}>
          <Button type="button" variant="secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}>Cancel</Button>
          <Button type="button" variant="primary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSave(); }}>Save Timing</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SubjectInput label="Subject Name" value={subject} onChangeValue={setSubject} required />
        <SelectDropdown
          label="Assessment Type"
          value={type}
          options={ASSESSMENT_TYPES.map((t) => ({ value: t.id, label: t.label }))}
          onChange={(v) => setType(v as AssessmentType)}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 12 }}>
          <AcademicSessionInput label="Academic Session" value={session} onChange={setSession} />
          <NumberInput label="Duration (Mins)" value={duration} min={1} max={300} onChange={(v) => setDuration(v)} />
          <NumberInput label="Pass Score (%)" value={passing} min={0} max={100} onChange={(v) => setPassing(v)} />
        </div>
      </div>
    </Modal>
  );
};
