import React from 'react';
import { Submission, Card, Badge, Button } from '@cbt/shared';

interface DashboardRecentSubsProps {
  submissions: Submission[];
  onViewAll: () => void;
}

export const DashboardRecentSubs: React.FC<DashboardRecentSubsProps> = ({ submissions, onViewAll }) => {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)' }}>Latest Student Work</h2>
        <Button variant="outline" size="sm" onClick={onViewAll}>Open Marking Queue</Button>
      </header>

      {submissions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          No tests submitted yet. When students complete tests on their terminals, their answers will show here.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {submissions.slice(-4).reverse().map((sub) => (
            <div
              key={sub.id}
              style={{
                padding: '12px 14px', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)' }}>{sub.studentName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {sub.examTitle} ({sub.classGroup})
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: sub.percentage >= 50 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {sub.percentage}%
                </div>
                <Badge color={sub.status === 'graded' ? 'emerald' : 'amber'}>
                  {sub.status === 'graded' ? 'Marked' : 'Needs Marking'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
