import React from 'react';
import { Users, BookOpen, ArrowRight } from '@phosphor-icons/react';
import { Card, Badge, Button } from '@cbt/shared';
import { ClassSummary } from './analytics-types';

interface ClassCardProps {
  summary: ClassSummary;
  onSelect: (className: string) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({ summary, onSelect }) => {
  const hasData = summary.totalSubmissions > 0;

  return (
    <Card
      style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        gap: 16, cursor: 'pointer', padding: '1.25rem',
        transition: 'transform 140ms ease, box-shadow 140ms ease',
      }}
      onClick={() => onSelect(summary.className)}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
            {summary.className}
          </h3>
          {summary.educationLevel && (
            <Badge color="blue" style={{ textTransform: 'capitalize' }}>
              {summary.educationLevel}
            </Badge>
          )}
        </div>

        <div style={{ display: 'flex', gap: 16, color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={16} />
            <span>{summary.studentsCount} Student{summary.studentsCount !== 1 ? 's' : ''}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookOpen size={16} />
            <span>{summary.subjectsCount} Subject{summary.subjectsCount !== 1 ? 's' : ''}</span>
          </span>
        </div>

        {hasData ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Class Average:</span>
              <strong style={{ color: summary.averageScore >= 50 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {summary.averageScore}% (Pass: {summary.passRate}%)
              </strong>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'var(--color-surface-hover)', overflow: 'hidden' }}>
              <div style={{ width: `${summary.averageScore}%`, height: '100%', background: summary.averageScore >= 50 ? 'var(--color-primary)' : 'var(--color-danger)', borderRadius: 999 }} />
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>
            No assessment results recorded yet.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
        <Button variant="outline" size="sm" onClick={() => onSelect(summary.className)} icon={<ArrowRight size={14} />}>
          View Class Results
        </Button>
      </div>
    </Card>
  );
};
