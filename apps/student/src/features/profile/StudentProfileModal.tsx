import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import { EDUCATION_LEVELS, EducationLevel, Department, StudentSession, Modal, Button, TextInput } from '@cbt/shared';
import { LevelSelector } from './LevelSelector';
import { DepartmentSelector } from './DepartmentSelector';
import { ClassSelector } from './ClassSelector';
import { ProfileStepProgress } from './ProfileStepProgress';

interface StudentProfileModalProps {
  isOpen: boolean; onClose: () => void;
  onProfileSubmit: (session: StudentSession) => void;
  initialSession?: StudentSession | null;
}

const STEP_TITLES = ['Your Full Name', 'School Level', 'Choose Class', 'Department Stream'];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen, onClose, onProfileSubmit, initialSession,
}) => {
  const [step, setStep] = useState(1);
  const [studentName, setStudentName] = useState(initialSession?.studentName ?? '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(initialSession?.educationLevel ?? 'senior_secondary');
  const [classGroup, setClassGroup] = useState<string>(initialSession?.classGroup ?? 'SSS 2');
  const [department, setDepartment] = useState<Department>(initialSession?.department ?? 'science');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrorMsg('');
      if (!initialSession) setStudentName('');
    }
  }, [isOpen, initialSession]);

  if (!isOpen) return null;
  const currentConfig = EDUCATION_LEVELS.find((l) => l.id === educationLevel);
  const totalSteps = currentConfig?.hasDepartments ? 4 : 3;

  const handleLevelChange = (lvl: EducationLevel) => {
    setEducationLevel(lvl);
    const cfg = EDUCATION_LEVELS.find((l) => l.id === lvl);
    if (cfg && cfg.classes.length > 0) setClassGroup(cfg.classes[0]);
  };

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMsg('');
    if (step === 1) {
      if (!studentName.trim()) return setErrorMsg('Please enter your full name to continue.');
      return setStep(2);
    }
    if (step < totalSteps) return setStep((s) => s + 1);
    onProfileSubmit({
      studentName: studentName.trim(), educationLevel, classGroup,
      department: currentConfig?.hasDepartments ? department : undefined,
      loggedInAt: new Date().toISOString(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Registration">
      <form onSubmit={handleNext} aria-label="Enter your student details">
        <ProfileStepProgress currentStep={step} totalSteps={totalSteps} title={STEP_TITLES[step - 1]} />
        <div style={{ minHeight: 140 }}>
          {step === 1 && (
            <TextInput label="What is your full name?" placeholder="e.g. Chimamanda Ngozi" value={studentName} onChange={(e) => { setStudentName(e.target.value); setErrorMsg(''); }} error={errorMsg} autoFocus />
          )}
          {step === 2 && <LevelSelector selectedLevel={educationLevel} onSelectLevel={handleLevelChange} />}
          {step === 3 && <ClassSelector selectedClass={classGroup} classes={currentConfig?.classes ?? []} onSelectClass={setClassGroup} />}
          {step === 4 && currentConfig?.hasDepartments && <DepartmentSelector department={department} onSelectDepartment={setDepartment} />}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, borderTop: '1px solid var(--color-border)', paddingTop: 16 }}>
          {step > 1 ? (
            <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)} icon={<ArrowLeft size={16} />}>Back</Button>
          ) : (
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          )}
          <Button type="submit" variant="primary" icon={<ArrowRight size={18} />}>
            {step === totalSteps ? 'See My Available Assessments' : 'Continue'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
