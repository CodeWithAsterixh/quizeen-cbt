import React from 'react';
import { ServerStatus } from './types';

interface Props {
  status: ServerStatus;
}

export const ServerStats: React.FC<Props> = ({ status }) => {
  const formatUptime = (seconds: number) => {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  return (
    <>
      <div className="server-card">
        <div className="server-card-label">Operational State</div>
        <div className="server-status-val">
          <div className={`status-dot ${status.running ? 'active' : 'inactive'}`} />
          <span>{status.running ? 'Active (Listening)' : 'Stopped'}</span>
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          Uptime: {formatUptime(status.uptimeSeconds)}
        </div>
      </div>
      <div className="server-card">
        <div className="server-card-label">Traffic Volume</div>
        <div className="server-status-val" style={{ color: 'var(--color-primary)' }}>
          {status.totalRequests}
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
          HTTP requests processed this session
        </div>
      </div>
    </>
  );
};
