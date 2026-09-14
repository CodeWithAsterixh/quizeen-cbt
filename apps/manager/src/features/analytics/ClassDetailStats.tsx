import React from 'react';
import { Card } from '@cbt/shared';
import { ClassSummary } from './analytics-types';

interface Props {
  summary?: ClassSummary;
  studentsCount: number;
  subjectsCount: number;
}

export const ClassDetailStats: React.FC<Props> = ({ summary, studentsCount, subjectsCount }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
    <Card style={{ padding: '1rem 1.25rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Class Average Score</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: (summary?.averageScore ?? 0) >= 50 ? 'var(--color-success)' : 'var(--color-danger)' }}>
        {summary?.averageScore ?? 0}%
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Pass Rate: {summary?.passRate ?? 0}%</div>
    </Card>
    <Card style={{ padding: '1rem 1.25rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Students Tested</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)' }}>{studentsCount}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Total on roster</div>
    </Card>
    <Card style={{ padding: '1rem 1.25rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Subjects Administered</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)' }}>{subjectsCount}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>{summary?.totalSubmissions ?? 0} total submissions</div>
    </Card>
  </div>
);
