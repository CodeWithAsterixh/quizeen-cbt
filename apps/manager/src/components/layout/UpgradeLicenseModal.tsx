import React, { useState } from 'react';
import { Modal, Button, CheckCircle, LockKey, ArrowSquareOut } from '@cbt/shared';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onActivated?: () => void;
  portalUrl?: string;
}

export const UpgradeLicenseModal: React.FC<Props> = ({ isOpen, onClose, onActivated, portalUrl }) => {
  const [key, setKey] = useState('');
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const targetUrl = portalUrl || 'http://localhost:3000/consult';

  const handleActivate = async () => {
    if (!key.trim()) return;
    setActivating(true);
    setError(null);
    try {
      const res = await fetch('/api/license/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: key.trim(), token: key.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to activate key');
      }
      onActivated?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Activation failed');
    } finally {
      setActivating(false);
    }
  };

  const handleOpenConsult = () => {
    if (typeof window !== 'undefined') {
      window.open(targetUrl, '_blank');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Institutional License" maxWidth="520px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
        <p style={{ margin: 0, color: 'var(--color-text-subtle, #4b5563)', lineHeight: 1.5 }}>
          You are currently running the <strong>Free Version</strong> (1 student, 1 server, 1 manager). Upgrade to an institutional license to unlock full school deployment.
        </p>

        <div style={{ background: 'var(--color-surface-hover, #f3f4f6)', padding: '12px', borderRadius: '6px' }}>
          <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '12px' }}>Full License Capabilities:</div>
          <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <li>Support for 40 to 500+ student workstations simultaneously</li>
            <li>Multi-lab exam management with department authoring</li>
            <li>Custom school crest and institutional branding</li>
          </ul>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" onClick={handleOpenConsult} icon={<ArrowSquareOut size={16} />}>
            Request School Quote & License
          </Button>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border, #e5e7eb)', paddingTop: '12px' }}>
          <div style={{ fontWeight: 600, marginBottom: '6px' }}>Already have an activation key?</div>
          {error && <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: '6px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              style={{ flex: 1, padding: '6px 10px', fontSize: '13px', fontFamily: 'monospace', borderRadius: '4px', border: '1px solid #d1d5db' }}
            />
            <Button variant="secondary" onClick={handleActivate} disabled={activating || !key.trim()} icon={<LockKey size={14} />}>
              {activating ? 'Activating...' : 'Activate'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
