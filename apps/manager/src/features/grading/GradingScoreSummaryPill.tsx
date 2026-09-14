import React from 'react';

interface Props {
  currentTotal: number;
  totalPoints: number;
  currentPct: number;
  passingScore: number;
  isPassed: boolean;
}

export const GradingScoreSummaryPill: React.FC<Props> = ({
  currentTotal, totalPoints, currentPct, passingScore, isPassed,
}) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface-hover)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
    <div>
      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>Total Awarded: </span>
      <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>{currentTotal} / {totalPoints} pts ({currentPct}%)</strong>
      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginLeft: '0.75rem' }}>Passing: {passingScore}%</span>
    </div>
    <span className={`badge ${isPassed ? 'badge-success' : 'badge-danger'}`}>
      {isPassed ? 'Passed' : 'Failed'}
    </span>
  </div>
);
