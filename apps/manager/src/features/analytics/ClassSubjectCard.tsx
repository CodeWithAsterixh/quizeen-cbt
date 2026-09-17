import React from 'react';
import { ArrowRight, Users, Trophy } from '@cbt/shared';
import { Card, Badge, Button } from '@cbt/shared';
import { ClassSubjectSummary } from './analytics-types';

interface Props {
  sub: ClassSubjectSummary;
  isSelected?: boolean;
  onToggleSelect?: (subjectId: string) => void;
  onSelectSubject: (subjectId: string) => void;
}

export const ClassSubjectCard: React.FC<Props> = ({ sub, isSelected, onToggleSelect, onSelectSubject }) => {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 200 }}>
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={Boolean(isSelected)}
            onChange={(e) => { e.stopPropagation(); onToggleSelect(sub.subjectId); }}
            style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            aria-label={`Select ${sub.subjectName}`}
          />
        )}
        <div>
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
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        {hasSubmissions ? (
          <div style={{ display: 'flex', gap: 20, textAlign: 'right' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Average</div>
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
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Highest</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Trophy size={16} /> {sub.highestScore}%
              </div>
            </div>
          </div>
        ) : (
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
            No submissions yet
          </span>
        )}

        <Button variant="primary" size="sm" onClick={() => onSelectSubject(sub.subjectId)} icon={<ArrowRight size={14} />}>
          View Scores
        </Button>
      </div>
    </Card>
  );
};
