import React from 'react';
import { Assessment, Card, Badge, Button } from '@cbt/shared';

interface DashboardRecentAssessmentsProps {
  assessments: Assessment[];
  onViewAll: () => void;
}

export const DashboardRecentAssessments: React.FC<DashboardRecentAssessmentsProps> = ({ assessments, onViewAll }) => {
  const exams = assessments;
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>Recent Assessments</h2>
        <Button variant="outline" size="sm" onClick={onViewAll}>View All</Button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {exams.slice(0, 4).map((exam) => (
          <div
            key={exam.id}
            style={{
              padding: '10px 14px', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>{exam.subject}</span>
                <span className={`badge ${exam.assessmentType === 'exam' ? 'badge-primary' : 'badge-secondary'}`} style={{ textTransform: 'capitalize', fontSize: '0.7rem' }}>
                  {exam.assessmentType ?? 'test'}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                {exam.session || '2024/2025'} • {exam.durationMinutes} mins • {exam.questions.length} questions
              </div>
            </div>
            <Badge color="blue">{exam.targetClasses.join(', ') || 'All Classes'}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const DashboardRecentExams = DashboardRecentAssessments;
