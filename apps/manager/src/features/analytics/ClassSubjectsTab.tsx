import React from 'react';
import { ArrowRight, Users, Trophy } from '@phosphor-icons/react';
import { Card, Badge, Button } from '@cbt/shared';
import { ClassSubjectSummary } from './analytics-types';

import { ClassSubjectCard } from './ClassSubjectCard';

interface ClassSubjectsTabProps {
  subjects: ClassSubjectSummary[];
  onSelectSubject: (subjectId: string) => void;
}

export const ClassSubjectsTab: React.FC<ClassSubjectsTabProps> = ({ subjects, onSelectSubject }) => {
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
        <ClassSubjectCard key={sub.subjectId} sub={sub} onSelectSubject={onSelectSubject} />
      ))}
    </div>
  );
};
