import React from 'react';
import { LogEntry } from '../types';

interface Props {
  log: LogEntry | null;
  totalLogs: number;
  currentIndex: number;
}

const getMethodColor = (m: string) => {
  if (m === 'POST') return 'var(--color-success)';
  if (m === 'DELETE') return 'var(--color-danger)';
  if (m === 'PUT') return 'var(--color-accent)';
  return 'var(--color-primary)';
};

export const GraphTooltip: React.FC<Props> = ({ log, totalLogs, currentIndex }) => {
  if (!log) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface-hover)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
        <span>Hover or drag cursor across graph to inspect past requests.</span>
        <span>{totalLogs} total requests logged</span>
      </div>
    );
  }

  const isErr = log.status >= 400;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', background: 'var(--color-surface-hover)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ padding: '2px 6px', borderRadius: '3px', fontWeight: 700, fontSize: '0.75rem', background: 'var(--color-surface)', color: getMethodColor(log.method) }}>
          {log.method}
        </span>
        <strong style={{ fontFamily: 'monospace', color: 'var(--color-text)' }}>{log.url}</strong>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-subtle)' }}>({log.ip})</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Latency: <strong style={{ color: 'var(--color-primary)' }}>{log.durationMs}ms</strong></span>
        <span style={{ fontWeight: 600, color: isErr ? 'var(--color-danger)' : 'var(--color-success)' }}>
          {log.status} {isErr ? 'ERR' : 'OK'}
        </span>
        <span style={{ color: 'var(--color-text-subtle)', fontSize: '0.75rem' }}>
          {log.timestamp.slice(11, 19)} [#{currentIndex + 1}]
        </span>
      </div>
    </div>
  );
};
