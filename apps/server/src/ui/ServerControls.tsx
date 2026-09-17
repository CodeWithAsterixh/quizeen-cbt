import React, { useState, useEffect } from 'react';
import { Play, Stop, Copy, Check } from '@cbt/shared';
import { ServerStatus } from './types';

interface Props {
  status: ServerStatus;
  onToggle: (port: number) => void;
  isPending?: boolean;
  errorMessage?: string | null;
  infoMessage?: string | null;
}

export const ServerControls: React.FC<Props> = ({ status, onToggle, isPending, errorMessage, infoMessage }) => {
  const [port, setPort] = useState(status.port || 4000);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [autoStart, setAutoStart] = useState(false);

  useEffect(() => {
    setAutoStart(localStorage.getItem('cbt_server_autostart') === 'true');
  }, []);

  useEffect(() => {
    if (status.port) setPort(status.port);
  }, [status.port]);

  const handleAutoStartChange = (checked: boolean) => {
    setAutoStart(checked);
    localStorage.setItem('cbt_server_autostart', checked ? 'true' : 'false');
  };

  const handleCopy = (ip: string) => {
    const activePort = status.running ? status.port : port;
    navigator.clipboard.writeText(`http://${ip}:${activePort}`);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  return (
    <div className="server-card">
      <div className="server-card-label">Server Control & Network</div>
      {errorMessage && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '6px 10px', borderRadius: 4, fontSize: '0.8rem', marginBottom: 10 }}>
          {errorMessage}
        </div>
      )}
      {infoMessage && (
        <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '6px 10px', borderRadius: 4, fontSize: '0.8rem', marginBottom: 10, border: '1px solid #bfdbfe' }}>
          {infoMessage}
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
        <input
          type="number"
          value={port}
          disabled={status.running || isPending}
          onChange={(e) => setPort(parseInt(e.target.value, 10) || 4000)}
          style={{ width: '80px', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}
        />
        <button
          disabled={isPending}
          onClick={() => onToggle(port)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 1rem',
            background: status.running ? '#ef4444' : '#10b981', color: '#fff',
            border: 'none', borderRadius: '4px', cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.7 : 1, fontWeight: 600,
          }}
        >
          {isPending
            ? (status.running ? 'Stopping...' : 'Starting...')
            : (status.running ? <><Stop weight="bold" /> Stop Server</> : <><Play weight="bold" /> Start Server</>)}
        </button>
      </div>
      <div className="ip-list">
        {(status.ips || []).map((ip) => (
          <div key={ip} className="ip-pill">
            <span>http://{ip}:{status.running ? status.port : port}</span>
            <button className="btn-copy" onClick={() => handleCopy(ip)}>
              {copiedIp === ip ? <Check size={12} /> : <Copy size={12} />}
              {copiedIp === ip ? ' Copied' : ' Copy'}
            </button>
          </div>
        ))}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-text-muted)', cursor: 'pointer', marginTop: 10 }}>
        <input
          type="checkbox"
          checked={autoStart}
          onChange={(e) => handleAutoStartChange(e.target.checked)}
        />
        <span>Auto-start server when app opens</span>
      </label>
    </div>
  );
};
