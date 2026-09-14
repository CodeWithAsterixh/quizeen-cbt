import React from 'react';
import { Modal, Button, Badge } from '@cbt/shared';
import { UpdatePhase } from '@cbt/shared';

interface Props {
  isOpen: boolean;
  phase: UpdatePhase;
  progress: number;
  latestVersion: string;
  error?: string | null;
  onStart: () => void;
  onDismiss: () => void;
  onRestart?: () => void;
}

export const UpdateProgressModal: React.FC<Props> = ({
  isOpen, phase, progress, latestVersion, error, onStart, onDismiss, onRestart,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={phase === 'downloading' ? () => {} : onDismiss} title="Station System Update">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>Available Version</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>v{latestVersion}</div>
          </div>
          <Badge color={phase === 'ready' ? 'emerald' : phase === 'failed' ? 'rose' : 'blue'}>
            {phase.toUpperCase()}
          </Badge>
        </div>

        {phase === 'idle' && (
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            A new version is available from the Central Server. Click update to download and install.
          </p>
        )}

        {phase === 'downloading' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Downloading update package</span>
              <strong>{progress}%</strong>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.2s ease' }} />
            </div>
          </div>
        )}

        {phase === 'installing' && (
          <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--color-text-muted)' }}>
            Applying update files. Please do not turn off station.
          </div>
        )}

        {phase === 'ready' && (
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-emerald)' }}>
            Update installed successfully. The station can now restart to apply changes.
          </p>
        )}

        {error && (
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-danger)' }}>{error}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
          {phase === 'idle' && (
            <>
              <Button variant="secondary" onClick={onDismiss}>Later</Button>
              <Button variant="primary" onClick={onStart}>Update Now</Button>
            </>
          )}
          {phase === 'ready' && (
            <Button variant="primary" onClick={onRestart || (() => window.location.reload())}>
              Restart Station
            </Button>
          )}
          {phase === 'failed' && (
            <>
              <Button variant="secondary" onClick={onDismiss}>Dismiss</Button>
              <Button variant="primary" onClick={onStart}>Retry</Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
