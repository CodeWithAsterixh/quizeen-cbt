import React from 'react';
import { TrendUp, CheckCircle, Trophy, Warning } from '@cbt/shared';
import { Card } from '@cbt/shared';

interface AnalyticsSummaryCardsProps {
  averageScore: number;
  passRate: number;
  totalSubmissions: number;
  totalInfractions: number;
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({
  averageScore,
  passRate,
  totalSubmissions,
  totalInfractions,
}) => {
  return (
    <section aria-label="Overall Exam Statistics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
      <Card accent="blue" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-hover)', color: 'var(--color-primary)' }}>
          <TrendUp size={24} weight="duotone" />
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>{averageScore}%</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Class Average</div>
        </div>
      </Card>

      <Card accent="emerald" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-hover)', color: 'var(--color-success)' }}>
          <CheckCircle size={24} weight="duotone" />
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>{passRate}%</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Students Passed</div>
        </div>
      </Card>

      <Card accent="purple" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-hover)', color: 'var(--color-primary)' }}>
          <Trophy size={24} weight="duotone" />
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>{totalSubmissions}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Tests Submitted</div>
        </div>
      </Card>

      <Card accent="rose" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-hover)', color: 'var(--color-danger)' }}>
          <Warning size={24} weight="duotone" />
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>{totalInfractions}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Exam App Switches</div>
        </div>
      </Card>
    </section>
  );
};
