import React from 'react';
import { CheckSquare, Square } from '@cbt/shared';
import { Exam, ExamScheduleConfig, DEPARTMENTS, Card, Badge, TextInput, SelectDropdown, Button } from '@cbt/shared';

interface CompilerScheduleRowProps {
  exam: Exam;
  isSelected: boolean;
  schedule: ExamScheduleConfig;
  onToggle: () => void;
  onUpdate: (updated: Partial<ExamScheduleConfig>) => void;
}

export const CompilerScheduleRow: React.FC<CompilerScheduleRowProps> = ({
  exam, isSelected, schedule, onToggle, onUpdate,
}) => {
  const deptOptions = [
    { value: '', label: 'All Departments (General)' },
    ...DEPARTMENTS.map((d) => ({ value: d.id, label: d.name })),
  ];

  return (
    <Card accent={isSelected ? 'blue' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 12, background: isSelected ? 'var(--color-surface-hover)' : 'var(--color-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Button variant="ghost" onClick={onToggle} style={{ padding: 0, gap: 10 }}>
          {isSelected ? <CheckSquare size={22} color="var(--color-primary)" weight="fill" /> : <Square size={22} color="var(--color-border-dark)" />}
          <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-text)' }}>{exam.title}</span>
          <Badge color="blue">{exam.subject}</Badge>
        </Button>
        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          {exam.questions.length} Questions • {exam.durationMinutes} Minutes
        </div>
      </div>

      {isSelected && (
        <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
          <legend className="sr-only">Schedule settings for {exam.title}</legend>
          <TextInput label="Class" value={schedule.targetClass} onChange={(e) => onUpdate({ targetClass: e.target.value })} />
          {exam.educationLevel === 'senior_secondary' && (
            <SelectDropdown label="Department" value={schedule.department ?? exam.department ?? ''} options={deptOptions} onChange={(val) => onUpdate({ department: (val || undefined) as any })} />
          )}
          <TextInput type="date" label="Exam Date" value={schedule.scheduledDate} onChange={(e) => onUpdate({ scheduledDate: e.target.value })} />
          <TextInput type="time" label="Earliest Start" value={schedule.startTime} onChange={(e) => onUpdate({ startTime: e.target.value })} />
          <TextInput type="time" label="Latest End" value={schedule.endTime} onChange={(e) => onUpdate({ endTime: e.target.value })} />
          <TextInput type="text" maxLength={4} label="PIN (Optional)" placeholder="e.g. 1234" value={schedule.unlockPin ?? ''} onChange={(e) => onUpdate({ unlockPin: e.target.value.replace(/\D/g, '') })} />
        </fieldset>
      )}
    </Card>
  );
};
