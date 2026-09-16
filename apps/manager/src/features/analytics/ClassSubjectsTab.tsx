import React from 'react';
import { ArrowRight, Users, Trophy } from '@cbt/shared';
import { Card, Badge, Button } from '@cbt/shared';
import { ClassSubjectSummary } from './analytics-types';

import { ClassSubjectCard } from './ClassSubjectCard';

interface ClassSubjectsTabProps {
  subjects: ClassSubjectSummary[];
  selectedIds?: string[];
  onToggleSelect?: (subjectId: string) => void;
  onSelectSubject: (subjectId: string) => void;
}

export const ClassSubjectsTab: React.FC<ClassSubjectsTabProps> = ({
  subjects, selectedIds, onToggleSelect, onSelectSubject,
}) => {
  if (subjects.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>No subjects or assessments assigned to this class yet.</p>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {subjects.map((sub) => (
        <ClassSubjectCard
          key={sub.subjectId}
          sub={sub}
          isSelected={selectedIds?.includes(sub.subjectId)}
          onToggleSelect={onToggleSelect}
          onSelectSubject={onSelectSubject}
        />
      ))}
    </div>
  );
};
