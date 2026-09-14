import React from 'react';
import { ArrowRight, Users, Trophy } from '@cbt/shared';
import { Card, Badge, Button } from '@cbt/shared';
import { ClassSubjectSummary } from './analytics-types';

interface Props {
  sub: ClassSubjectSummary;
  onSelectSubject: (subjectId: string) => void;
}

export const ClassSubjectCard: React.FC<Props> = ({ sub, onSelectSubject }) => {
  const hasSubmissions = sub.submissionsCount > 0;

  return (
    <Card
      style={{
        padding: '1.15rem 1.4rem', cursor: 'pointer',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        transition: 'background-color 120ms ease',
      }}
      onClick={() => onSelectSubject(sub.subjectId)}
    >
      <div style={{ minWidth: 200 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
            {sub.subjectName}
          </h3>
          <Badge color={sub.assessmentType === 'exam' ? 'purple' : 'blue'} style={{ textTransform: 'capitalize' }}>
            {sub.assessmentType}
          </Badge>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', gap: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={15} /> {sub.submissionsCount} Tested
          </span>
          <span>•</span>
          <span>Passing: {sub.passingScore}%</span>
          <span>•</span>
          <span>Total: {sub.totalPoints} pts</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        {hasSubmissions ? (
          <div style={{ display: 'flex', gap: 20, textAlign: 'right' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Subject Average</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: sub.averageScore >= 50 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {sub.averageScore}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Pass Rate</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                {sub.passRate}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Top Score</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Trophy size={16} /> {sub.highestScore}%
              </div>
            </div>
          </div>
        ) : (
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>
            Awaiting submissions
          </span>
        )}

        <Button variant="primary" size="sm" onClick={() => onSelectSubject(sub.subjectId)} icon={<ArrowRight size={14} />}>
          View Student Breakdown
        </Button>
      </div>
    </Card>
  );
};
