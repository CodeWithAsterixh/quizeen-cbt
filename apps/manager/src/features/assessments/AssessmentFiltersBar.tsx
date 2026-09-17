import React from 'react';
import { MagnifyingGlass } from '@cbt/shared';
import { EDUCATION_LEVELS, DEPARTMENTS, Card, SubjectInput, SelectDropdown, ASSESSMENT_TYPES } from '@cbt/shared';

interface AssessmentFiltersBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  sessionFilter: string;
  onSessionChange: (val: string) => void;
  availableSessions: string[];
  typeFilter: string;
  onTypeChange: (val: string) => void;
  levelFilter: string;
  onLevelChange: (val: string) => void;
  deptFilter: string;
  onDeptChange: (val: string) => void;
}

export const AssessmentFiltersBar: React.FC<AssessmentFiltersBarProps> = ({
  searchTerm, onSearchChange, sessionFilter, onSessionChange, availableSessions,
  typeFilter, onTypeChange, levelFilter, onLevelChange, deptFilter, onDeptChange,
}) => {
  const sessionOptions = [
    { value: 'all', label: 'All Sessions' },
    ...availableSessions.map((s) => ({ value: s, label: s })),
  ];
  const typeOptions = [
    { value: 'all', label: 'All Assessment Types' },
    ...ASSESSMENT_TYPES.map((t) => ({ value: t.id, label: t.label })),
  ];
  const levelOptions = [
    { value: 'all', label: 'All School Levels' },
    ...EDUCATION_LEVELS.map((lvl) => ({ value: lvl.id, label: lvl.name })),
  ];
  const deptOptions = [
    { value: 'all', label: 'All Departments' },
    ...DEPARTMENTS.map((dept) => ({ value: dept.id, label: dept.name })),
  ];

  return (
    <Card style={{ padding: '14px 18px' }}>
      <div className="filters-grid">
        <SubjectInput
          placeholder="Search by assessment or subject..."
          value={searchTerm}
          onChangeValue={onSearchChange}
          icon={<MagnifyingGlass size={18} />}
        />
        <SelectDropdown value={sessionFilter} onChange={(val) => onSessionChange(val)} options={sessionOptions} />
        <SelectDropdown value={typeFilter} onChange={(val) => onTypeChange(val)} options={typeOptions} />
        <SelectDropdown value={levelFilter} onChange={(val) => onLevelChange(val)} options={levelOptions} />
        <SelectDropdown value={deptFilter} onChange={(val) => onDeptChange(val)} options={deptOptions} />
      </div>
    </Card>
  );
};

export const ExamFiltersBar = AssessmentFiltersBar;
