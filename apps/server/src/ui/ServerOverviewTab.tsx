import React, { useState, useEffect } from 'react';
import { Button, Copy, Check } from '@cbt/shared';
import { ServerStatus } from './types';
import { ServerControls } from './ServerControls';
import { ServerStats } from './ServerStats';

interface Props {
  status: ServerStatus;
  onToggle: (port: number) => void;
  errorMessage?: string | null;
  infoMessage?: string | null;
}

export const ServerOverviewTab: React.FC<Props> = ({ status, onToggle, errorMessage, infoMessage }) => {
  const [copied, setCopied] = useState(false);
  const [hwId, setHwId] = useState(status.hardwareId || '');

  useEffect(() => {
    if (status.hardwareId) {
      setHwId(status.hardwareId);
      return;
    }
    fetch(`http://127.0.0.1:${status.port || 4000}/api/license`)
      .then((r) => r.json())
      .then((d) => { if (d?.data?.hardwareId) setHwId(d.data.hardwareId); })
      .catch(() => {});
  }, [status.hardwareId, status.port]);

  const handleCopy = () => {
    if (!hwId) return;
    navigator.clipboard.writeText(hwId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="server-cards-grid">
        <ServerControls status={status} onToggle={onToggle} errorMessage={errorMessage} infoMessage={infoMessage} />
        <ServerStats status={status} />
      </div>

      <div className="server-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="server-card-label" style={{ margin: 0, fontSize: '0.75rem' }}>Server Hardware ID</div>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
            {hwId || 'Resolving...'}
          </span>
        </div>
        <Button size="sm" variant="secondary" onClick={handleCopy} icon={copied ? <Check size={14} /> : <Copy size={14} />}>
          {copied ? 'Copied' : 'Copy ID'}
        </Button>
      </div>

      <div className="server-card" style={{ padding: '1rem 1.25rem' }}>
        <div className="server-card-label">How to Connect Other Computers</div>
        <p style={{ margin: '0.25rem 0 0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          Students and teachers on the same local network can connect to this server directly.
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <li>Open the Student Portal or Assessment Manager on another computer.</li>
          <li>Click Server Connection in the settings menu.</li>
          <li>Enter any network IP address listed above (for example, http://{status.ips?.[0] || '127.0.0.1'}:{status.port}).</li>
        </ul>
      </div>
    </div>
  );
};
