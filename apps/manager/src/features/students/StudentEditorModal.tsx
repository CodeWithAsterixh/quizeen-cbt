import React, { useState, useEffect } from 'react';
import {
  Student, EducationLevel, Department, EDUCATION_LEVELS,
  Modal, Button, TextInput, LevelSelector, ClassSelector, DepartmentSelector,
} from '@cbt/shared';

interface Props {
  isOpen: boolean;
  student?: Student | null;
  onClose: () => void;
  onSave: (student: { id?: string; name: string; educationLevel: EducationLevel; classGroup: string; department?: Department }) => Promise<void>;
}

export const StudentEditorModal: React.FC<Props> = ({ isOpen, student, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<EducationLevel>('senior_secondary');
  const [classGroup, setClassGroup] = useState('SSS 2');
  const [department, setDepartment] = useState<Department>('science');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(student?.name || '');
      setLevel(student?.educationLevel || 'senior_secondary');
      setClassGroup(student?.classGroup || 'SSS 2');
      setDepartment(student?.department || 'science');
      setError('');
    }
  }, [isOpen, student]);

  if (!isOpen) return null;
  const currentConfig = EDUCATION_LEVELS.find((l) => l.id === level);

  const handleLevelSelect = (lvl: EducationLevel) => {
    setLevel(lvl);
    const cfg = EDUCATION_LEVELS.find((l) => l.id === lvl);
    if (cfg && cfg.classes.length > 0) setClassGroup(cfg.classes[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Please enter the student full name.');
    await onSave({
      id: student?.id,
      name: name.trim(),
      educationLevel: level,
      classGroup,
      department: currentConfig?.hasDepartments ? department : undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={student ? 'Edit Student Information' : 'Add New Student'} maxWidth={560}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && <div style={{ color: '#dc2626', fontSize: '0.85rem', background: '#fee2e2', padding: '8px 12px', borderRadius: 4 }}>{error}</div>}
        <TextInput label="Student Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ibrahim Chukwuemeka" required />
        <LevelSelector selectedLevel={level} onSelectLevel={handleLevelSelect} legendText="School Level" />
        {currentConfig && <ClassSelector selectedClass={classGroup} classes={currentConfig.classes} onSelectClass={setClassGroup} legendText="Class Group" />}
        {currentConfig?.hasDepartments && <DepartmentSelector department={department} onSelectDepartment={setDepartment} legendText="Department Stream" />}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">{student ? 'Save Changes' : 'Create Student'}</Button>
        </div>
      </form>
    </Modal>
  );
};
