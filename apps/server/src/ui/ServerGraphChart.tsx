import React, { useState } from 'react';
import { GraphBucket } from './serverGraphUtils';

interface Props {
  buckets: GraphBucket[];
  metric: 'latency' | 'status';
}

export const ServerGraphChart: React.FC<Props> = ({ buckets, metric }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (buckets.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-subtle)' }}>
        No request data yet. Start the server and send requests to view activity.
      </div>
    );
  }

  const maxVal = Math.max(...buckets.map((b) => (metric === 'latency' ? b.avgDuration : 1)), 10);
  const activeBucket = hoveredIdx !== null ? buckets[hoveredIdx] : buckets[buckets.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '170px', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
        {buckets.map((b, i) => {
          const val = metric === 'latency' ? b.avgDuration : (b.errorCount > 0 ? 0.4 : 1);
          const heightPct = Math.max(8, Math.round((val / maxVal) * 100));
          const isErr = b.errorCount > 0;
          const isSelected = hoveredIdx === i;
          const barColor = isErr ? 'var(--color-danger)' : (isSelected ? 'var(--color-primary-hover)' : 'var(--color-primary)');

          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                height: '100%', justifyContent: 'flex-end', cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '100%', maxWidth: '28px', height: `${heightPct}%`,
                  backgroundColor: barColor, borderRadius: '4px 4px 0 0',
                  transition: 'height 160ms ease, background-color 160ms ease',
                  opacity: hoveredIdx !== null && !isSelected ? 0.55 : 1,
                }}
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
                {b.label}
              </span>
            </div>
          );
        })}
      </div>

      {activeBucket && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface-hover)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
          <div>
            <span style={{ color: 'var(--color-text-subtle)' }}>Endpoint: </span>
            <strong style={{ fontFamily: 'monospace' }}>{activeBucket.topUrl || 'None'}</strong>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Time: <strong>{activeBucket.label}</strong></span>
            <span>Latency: <strong>{activeBucket.avgDuration}ms</strong></span>
            <span style={{ color: activeBucket.errorCount > 0 ? 'var(--color-danger)' : 'var(--color-success)', fontWeight: 600 }}>
              {activeBucket.errorCount > 0 ? 'Error Response' : 'Normal Response'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
