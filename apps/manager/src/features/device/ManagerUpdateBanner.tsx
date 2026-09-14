import React from 'react';
import { Button, UpdatePhase } from '@cbt/shared';

interface Props {
  visible: boolean;
  phase: UpdatePhase;
  progress: number;
  latestVersion: string;
  error?: string | null;
  onStart: () => void;
  onDismiss: () => void;
  onRestart?: () => void;
}

export const ManagerUpdateBanner: React.FC<Props> = ({
  visible, phase, progress, latestVersion, error, onStart, onDismiss, onRestart,
}) => {
  if (!visible && phase === 'idle') return null;

  return (
    <div style={{
      background: phase === 'ready' ? 'var(--color-emerald)' : 'var(--color-surface-2)',
      borderBottom: '1px solid var(--color-border)',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      fontSize: '0.85rem',
      fontWeight: 500,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        {phase === 'idle' && (
          <span>Assessment Manager v{latestVersion} is available from Central Server.</span>
        )}
        {phase === 'downloading' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: 360 }}>
            <span>Downloading update: {progress}%</span>
            <div style={{ flex: 1, height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--color-primary)' }} />
            </div>
          </div>
        )}
        {phase === 'installing' && <span>Applying update files...</span>}
        {phase === 'ready' && <span style={{ color: '#fff' }}>Update installed. Restart Manager to apply changes.</span>}
        {phase === 'failed' && <span style={{ color: 'var(--color-danger)' }}>Update failed: {error}</span>}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {phase === 'idle' && (
          <>
            <Button size="sm" variant="primary" onClick={onStart}>Update Now</Button>
            <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-subtle)' }}>X</button>
          </>
        )}
        {phase === 'ready' && (
          <Button size="sm" variant="secondary" onClick={onRestart || (() => window.location.reload())}>
            Restart Now
          </Button>
        )}
        {phase === 'failed' && (
          <>
            <Button size="sm" variant="secondary" onClick={onStart}>Retry</Button>
            <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>X</button>
          </>
        )}
      </div>
    </div>
  );
};
