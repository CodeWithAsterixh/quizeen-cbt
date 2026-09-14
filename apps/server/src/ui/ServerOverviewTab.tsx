import React from 'react';
import { ServerStatus } from './types';
import { ServerControls } from './ServerControls';
import { ServerStats } from './ServerStats';

interface Props {
  status: ServerStatus;
  onToggle: (port: number) => void;
}

export const ServerOverviewTab: React.FC<Props> = ({ status, onToggle }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="server-cards-grid">
        <ServerControls status={status} onToggle={onToggle} />
        <ServerStats status={status} />
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
