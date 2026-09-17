import React from 'react';
import {
  EducationLevel,
  Department,
  AssessmentType,
  ASSESSMENT_TYPES,
  EDUCATION_LEVELS,
  DEPARTMENTS,
  Card,
  TextInput,
  AcademicSessionInput,
  SelectDropdown,
  Button,
} from '@cbt/shared';

interface AssessmentMetaFieldsProps {
  subject: string; setSubject: (v: string) => void;
  session: string; setSession: (v: string) => void;
  assessmentType: AssessmentType; setAssessmentType: (v: AssessmentType) => void;
  durationMinutes: number; setDurationMinutes: (v: number) => void;
  passingScore: number; setPassingScore: (v: number) => void;
  educationLevel: EducationLevel; onLevelChange: (lvl: EducationLevel) => void;
  selectedClasses: string[]; onToggleClass: (cls: string) => void;
  department?: Department; setDepartment: (v?: Department) => void;
}

export const AssessmentMetaFields: React.FC<AssessmentMetaFieldsProps> = ({
  subject, setSubject, session, setSession, assessmentType, setAssessmentType,
  durationMinutes, setDurationMinutes, passingScore, setPassingScore,
  educationLevel, onLevelChange, selectedClasses, onToggleClass,
  department, setDepartment,
}) => {
  const currentConfig = EDUCATION_LEVELS.find((lvl) => lvl.id === educationLevel);
  const levelOptions = EDUCATION_LEVELS.map((lvl) => ({ value: lvl.id, label: lvl.name }));
  const deptOptions = [
    { value: '', label: 'All Departments (General Subject e.g. English, Maths)' },
    ...DEPARTMENTS.map((dept) => ({ value: dept.id, label: dept.name })),
  ];

  return (
    <Card accent="blue" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
      <TextInput label="Subject" placeholder="e.g. Mathematics" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      <AcademicSessionInput label="Academic Session" value={session} onChange={setSession} required />
      <div>
        <label className="cbt-input-label" style={{ marginBottom: 6, display: 'block' }}>Assessment Type</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {ASSESSMENT_TYPES.map((t) => (
            <Button key={t.id} type="button" variant={assessmentType === t.id ? 'primary' : 'outline'} size="sm" onClick={() => setAssessmentType(t.id)} style={{ flex: 1 }}>
              {t.label}
            </Button>
          ))}
        </div>
      </div>
      <TextInput type="number" min={1} max={300} label="Time Allowed (Minutes)" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} />
      <TextInput type="number" min={1} max={100} label="Pass Mark (%)" value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} />
      <SelectDropdown label="School Section" value={educationLevel} options={levelOptions} onChange={(val) => onLevelChange(val as EducationLevel)} />
      {currentConfig?.hasDepartments && (
        <SelectDropdown label="Department Stream" value={department ?? ''} options={deptOptions} onChange={(val) => setDepartment((val || undefined) as Department | undefined)} />
      )}
      <div style={{ gridColumn: 'span 2' }}>
        <label className="cbt-input-label" style={{ marginBottom: 6, display: 'block' }}>Which classes should take this assessment?</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {currentConfig?.classes.map((cls) => (
            <Button key={cls} type="button" variant={selectedClasses.includes(cls) ? 'primary' : 'outline'} size="sm" onClick={() => onToggleClass(cls)}>
              {cls}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export const ExamMetaFields = AssessmentMetaFields;
