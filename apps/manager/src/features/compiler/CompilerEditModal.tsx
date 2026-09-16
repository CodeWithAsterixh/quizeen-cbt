import React, { useState, useEffect } from 'react';
import {
  Modal, Button, TextInput, LevelSelector, ClassSelector, DepartmentSelector,
  Exam, ExamScheduleConfig, EducationLevel, EDUCATION_LEVELS,
} from '@cbt/shared';

interface Props {
  isOpen: boolean;
  exam: Exam;
  schedule: ExamScheduleConfig;
  onClose: () => void;
  onSave: (updated: Partial<ExamScheduleConfig>) => void;
}

const findLevel = (cls: string, fallback: EducationLevel): EducationLevel => {
  const found = EDUCATION_LEVELS.find((l) => l.classes.includes(cls));
  return found ? found.id : fallback;
};

export const CompilerEditModal: React.FC<Props> = ({ isOpen, exam, schedule, onClose, onSave }) => {
  const [level, setLevel] = useState<EducationLevel>(() => findLevel(schedule.targetClass, exam.educationLevel || 'senior_secondary'));
  const [targetClass, setTargetClass] = useState(schedule.targetClass);
  const [department, setDepartment] = useState(schedule.department ?? exam.department ?? '');
  const [scheduledDate, setScheduledDate] = useState(schedule.scheduledDate);
  const [startTime, setStartTime] = useState(schedule.startTime);
  const [endTime, setEndTime] = useState(schedule.endTime);
  const [pin, setPin] = useState(schedule.unlockPin ?? '');

  useEffect(() => {
    if (isOpen) {
      setLevel(findLevel(schedule.targetClass, exam.educationLevel || 'senior_secondary'));
      setTargetClass(schedule.targetClass);
      setDepartment(schedule.department ?? exam.department ?? '');
      setScheduledDate(schedule.scheduledDate);
      setStartTime(schedule.startTime);
      setEndTime(schedule.endTime);
      setPin(schedule.unlockPin ?? '');
    }
  }, [isOpen, schedule, exam]);

  if (!isOpen) return null;

  const currentConfig = EDUCATION_LEVELS.find((l) => l.id === level);
  const classes = currentConfig?.classes || [targetClass];

  const handleLevelChange = (lvl: EducationLevel) => {
    setLevel(lvl);
    const cfg = EDUCATION_LEVELS.find((l) => l.id === lvl);
    if (cfg && cfg.classes.length > 0) setTargetClass(cfg.classes[0]);
    if (!cfg?.hasDepartments) setDepartment('');
  };

  const handleSave = () => {
    onSave({
      targetClass, department: (department || undefined) as any,
      scheduledDate, startTime, endTime, unlockPin: pin.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Customize Export: ${exam.title}`} maxWidth={540}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <LevelSelector selectedLevel={level} onSelectLevel={handleLevelChange} legendText="School Level" />
        <ClassSelector selectedClass={targetClass} classes={classes} onSelectClass={setTargetClass} legendText="Target Class" />
        {currentConfig?.hasDepartments && (
          <DepartmentSelector
            department={department as any}
            onSelectDepartment={(val) => setDepartment(val)}
            allowAll={true}
            allLabel="All Departments (General)"
            legendText="Department Stream"
          />
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <TextInput type="date" label="Date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
          <TextInput type="time" label="Start" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <TextInput type="time" label="End" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        <TextInput
          label="Access PIN (Optional)"
          maxLength={6}
          placeholder="e.g. 1234"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          helperText="Students must enter this PIN to unlock this exported assessment"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Customization</Button>
        </div>
      </div>
    </Modal>
  );
};
