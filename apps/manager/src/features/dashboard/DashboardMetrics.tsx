import React from 'react';
import { BookOpen, Archive, Users, ClipboardText } from '@phosphor-icons/react';
import { Card } from '@cbt/shared';

interface DashboardMetricsProps {
  examCount: number;
  availableCount: number;
  submissionCount: number;
  pendingGradingCount: number;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  examCount,
  availableCount,
  submissionCount,
  pendingGradingCount,
}) => {
  return (
    <section aria-label="Summary numbers" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
      <Card accent="blue" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
          <BookOpen size={26} weight="fill" />
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>{examCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Tests Created</div>
        </div>
      </Card>

      <Card accent="purple" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}>
          <Archive size={26} weight="fill" />
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>{availableCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Available to Take</div>
        </div>
      </Card>

      <Card accent="emerald" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
          <Users size={26} weight="fill" />
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>{submissionCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Students Assessed</div>
        </div>
      </Card>

      <Card accent="amber" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ padding: 10, borderRadius: 'var(--radius-sm)', background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
          <ClipboardText size={26} weight="fill" />
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>{pendingGradingCount}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>To Be Marked</div>
        </div>
      </Card>
    </section>
  );
};
