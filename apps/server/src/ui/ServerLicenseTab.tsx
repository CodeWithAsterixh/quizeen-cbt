import React, { useState, useEffect, useCallback } from 'react';
import { LicenseState, Badge, Button, Copy, Check, LockKey } from '@cbt/shared';

interface Props {
  port?: number;
}

export const ServerLicenseTab: React.FC<Props> = ({ port = 4000 }) => {
  const [state, setState] = useState<LicenseState | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const getUrl = useCallback((path: string) => `http://127.0.0.1:${port}/api/${path}`, [port]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(getUrl('license'));
      if (res.ok) setState((await res.json()).data);
    } catch {}
  }, [getUrl]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleCopyHw = () => {
    if (!state?.hardwareId) return;
    navigator.clipboard.writeText(state.hardwareId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActivate = async () => {
    setMsg(null);
    try {
      const res = await fetch(getUrl('license/activate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'ok', text: 'License activated successfully.' });
        setState(data.state);
        setTokenInput('');
      } else {
        setMsg({ type: 'err', text: data.error || 'Activation failed.' });
      }
    } catch (err: any) {
      setMsg({ type: 'err', text: err?.message || 'Server connection failed.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="server-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Server License & Customization</h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>Hardware binding and term activation</p>
          </div>
          <Badge color={state?.status === 'active' ? 'emerald' : state?.status === 'expired' ? 'amber' : 'rose'}>
            {state?.status?.toUpperCase() || 'UNLICENSED'}
          </Badge>
        </div>

        <div style={{ background: 'var(--color-surface-2)', padding: '10px 14px', borderRadius: 4, marginBottom: 14, border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-subtle)' }}>SERVER HARDWARE ID</div>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem' }}>{state?.hardwareId || 'Computing...'}</span>
          </div>
          <Button size="sm" variant="secondary" onClick={handleCopyHw} icon={copied ? <Check size={14} /> : <Copy size={14} />}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        {state?.license && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
            <div style={{ background: 'var(--color-surface-hover)', padding: '8px 12px', borderRadius: 4 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', display: 'block' }}>School Name</span>
              <strong style={{ fontSize: '0.9rem' }}>{state.license.branding.schoolName}</strong>
            </div>
            <div style={{ background: 'var(--color-surface-hover)', padding: '8px 12px', borderRadius: 4 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', display: 'block' }}>Term & Validity</span>
              <strong style={{ fontSize: '0.9rem' }}>{state.license.term} ({state.daysRemaining} days left)</strong>
            </div>
            <div style={{ background: 'var(--color-surface-hover)', padding: '8px 12px', borderRadius: 4 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', display: 'block' }}>Station Quota</span>
              <strong style={{ fontSize: '0.9rem' }}>{state.license.stationLimit} Student Stations</strong>
            </div>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Activate New License Token</div>
          {msg && <div style={{ padding: '6px 10px', borderRadius: 4, marginBottom: 8, fontSize: '0.8rem', background: msg.type === 'ok' ? '#ecfdf5' : '#fef2f2', color: msg.type === 'ok' ? '#047857' : '#b91c1c' }}>{msg.text}</div>}
          <textarea value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="Paste signed license JSON token here..." style={{ width: '100%', height: 60, padding: '8px', fontSize: '0.75rem', fontFamily: 'monospace', borderRadius: 4, border: '1px solid var(--color-border)', marginBottom: 8 }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button size="sm" variant="primary" onClick={handleActivate} disabled={!tokenInput.trim()} icon={<LockKey size={14} />}>Activate License</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
