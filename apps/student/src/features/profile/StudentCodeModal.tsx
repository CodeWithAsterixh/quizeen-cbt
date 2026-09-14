import React, { useState, useEffect } from 'react';
import { WarningCircle, ArrowRight } from '@cbt/shared';
import { Student, StudentSession, LocalStore, apiClient, Modal, Button } from '@cbt/shared';
import { OtpCodeInput } from './OtpCodeInput';
import { StudentVerifiedCard } from './StudentVerifiedCard';
import { useStudentLookup } from './useStudentLookup';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProfileSubmit: (session: StudentSession) => void;
}

export const StudentCodeModal: React.FC<Props> = ({ isOpen, onClose, onProfileSubmit }) => {
  const { code, setCode, loading, error, foundStudent, setFoundStudent, reset, lookup: handleLookup } = useStudentLookup();

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProceed = () => {
    if (!foundStudent) return;
    const s = foundStudent;
    reset();
    onProfileSubmit({
      studentId: s.id, studentCode: s.code, studentName: s.name,
      educationLevel: s.educationLevel, classGroup: s.classGroup,
      department: s.department, loggedInAt: new Date().toISOString(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Candidate Exam Login" maxWidth={480}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Enter the 6-character Student ID code provided by your teacher.
        </p>

        <OtpCodeInput value={code} onChange={setCode} onComplete={handleLookup} disabled={loading} />

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', textAlign: 'left' }}>
            <WarningCircle size={20} weight="fill" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {foundStudent && <StudentVerifiedCard student={foundStudent} />}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          {foundStudent ? (
            <Button variant="primary" onClick={handleProceed} icon={<ArrowRight size={16} />}>Start Assessments</Button>
          ) : (
            <Button variant="primary" disabled={code.length !== 6 || loading} onClick={() => handleLookup(code)}>
              {loading ? 'Checking...' : 'Verify ID'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
