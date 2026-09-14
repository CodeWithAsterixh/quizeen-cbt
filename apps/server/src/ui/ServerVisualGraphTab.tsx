import React, { useState } from 'react';
import { LogEntry } from './types';
import { computeServerMetrics, buildGraphBuckets } from './serverGraphUtils';
import { ServerGraphChart } from './ServerGraphChart';

interface Props {
  logs: LogEntry[];
}

export const ServerVisualGraphTab: React.FC<Props> = ({ logs }) => {
  const [metric, setMetric] = useState<'latency' | 'status'>('latency');
  const metrics = computeServerMetrics(logs);
  const buckets = buildGraphBuckets(logs);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
            Interactive Visual Graph
          </h2>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
            Track live server speed and response health across incoming requests.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn-copy ${metric === 'latency' ? 'active-btn' : ''}`}
            onClick={() => setMetric('latency')}
          >
            Response Time (ms)
          </button>
          <button
            className={`btn-copy ${metric === 'status' ? 'active-btn' : ''}`}
            onClick={() => setMetric('status')}
          >
            Response Health
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
        <div className="server-card" style={{ padding: '0.75rem 1rem' }}>
          <div className="server-card-label">Average Speed</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-primary)' }}>{metrics.avgDuration} ms</div>
        </div>
        <div className="server-card" style={{ padding: '0.75rem 1rem' }}>
          <div className="server-card-label">Success Rate</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: metrics.successRate >= 95 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {metrics.successRate}%
          </div>
        </div>
        <div className="server-card" style={{ padding: '0.75rem 1rem' }}>
          <div className="server-card-label">Requests Logged</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)' }}>{metrics.total}</div>
        </div>
        <div className="server-card" style={{ padding: '0.75rem 1rem' }}>
          <div className="server-card-label">Error Responses</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: metrics.error > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
            {metrics.error}
          </div>
        </div>
      </div>

      <div className="server-card" style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
          {metric === 'latency' ? 'Latency Over Recent Requests (ms)' : 'Status Health (Green = 2xx/3xx, Red = 4xx/5xx)'}
        </div>
        <ServerGraphChart buckets={buckets} metric={metric} />
      </div>
    </div>
  );
};
