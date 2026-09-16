import React from 'react';
import { Button, ArrowsClockwise } from '@cbt/shared';

interface Props {
  onSync: () => Promise<void>;
  isSyncing: boolean;
}

export const SettingsSyncCard: React.FC<Props> = ({ onSync, isSyncing }) => {
  return (
    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Data Synchronization</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Synchronize assessments, student rosters, and submissions with the central server.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={onSync}
          disabled={isSyncing}
          icon={<ArrowsClockwise size={18} className={isSyncing ? 'cbt-spin' : ''} />}
        >
          {isSyncing ? 'Syncing...' : 'Sync Data Now'}
        </Button>
      </div>

      <div style={{ padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 6, fontSize: '0.82rem', color: 'var(--color-text-subtle)' }}>
        Local data strictly mirrors the active central server. Press F5 or Ctrl+R anywhere in Manager to perform a rapid sync.
      </div>
    </div>
  );
};
