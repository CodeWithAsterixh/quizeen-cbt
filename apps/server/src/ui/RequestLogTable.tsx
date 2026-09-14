import React, { useState } from 'react';
import { Trash, DownloadSimple, MagnifyingGlass } from '@cbt/shared';
import { LogEntry } from './types';

interface Props {
  logs: LogEntry[];
  onClear: () => void;
}

export const RequestLogTable: React.FC<Props> = ({ logs, onClear }) => {
  const [filter, setFilter] = useState('');

  const filteredLogs = logs.filter(
    (l) => l.url.toLowerCase().includes(filter.toLowerCase()) || l.method.toLowerCase().includes(filter.toLowerCase())
  );

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cbt-server-logs-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="logs-container">
      <div className="logs-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Live Requests ({logs.length})</span>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            <MagnifyingGlass size={14} color="var(--color-text-subtle)" />
            <input
              type="text" placeholder="Filter routes..." value={filter} onChange={(e) => setFilter(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '0.25rem', fontSize: '0.75rem' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-copy" onClick={handleExport}><DownloadSimple /> Export</button>
          <button className="btn-copy" onClick={onClear}><Trash /> Clear</button>
        </div>
      </div>
      <div className="logs-table-wrap">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Time</th><th>Method</th><th>Endpoint</th><th>Status</th><th>Latency</th><th>Client IP</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.slice().reverse().map((entry) => (
              <tr key={entry.id}>
                <td style={{ color: 'var(--color-text-subtle)' }}>{entry.timestamp.slice(11, 19)}</td>
                <td><span className={`method-badge ${entry.method}`}>{entry.method}</span></td>
                <td style={{ fontFamily: 'monospace' }}>{entry.url}</td>
                <td className={entry.status < 400 ? 'status-code-200' : 'status-code-error'}>{entry.status}</td>
                <td>{entry.durationMs}ms</td>
                <td style={{ fontFamily: 'monospace' }}>{entry.ip}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-subtle)' }}>No requests captured yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
