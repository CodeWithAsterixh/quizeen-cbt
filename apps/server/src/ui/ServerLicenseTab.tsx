import React, { useState, useEffect, useCallback } from 'react';
import { LicenseState, Badge, Button, Copy, Check, LockKey } from '@cbt/shared';

export const ServerLicenseTab: React.FC<{ port?: number }> = ({ port = 4000 }) => {
  const [state, setState] = useState<LicenseState | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const getUrl = useCallback((p: string) => `http://127.0.0.1:${port}/api/${p}`, [port]);
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(getUrl('license'), { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        const d = (await res.json()).data;
        setState(d);
        if (d?.license?.branding) (window as any).electronApi?.applyBranding?.(d.license.branding);
      }
    } catch {}
  }, [getUrl]);
  useEffect(() => { fetchStatus(); }, [fetchStatus]);
  const handleCopyHw = () => {
    if (state?.hardwareId) { navigator.clipboard.writeText(state.hardwareId); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => { const t = ev.target?.result as string; if (t) setTokenInput(t.trim()); };
    r.readAsText(f);
  };
  const handleActivate = async () => {
    setMsg(null);
    try {
      const res = await fetch(getUrl('license/activate'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: tokenInput.trim(), token: tokenInput.trim() }) });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'ok', text: 'License activated.' }); setState(data.state); setTokenInput('');
        if (data.state?.license?.branding) (window as any).electronApi?.applyBranding?.(data.state.license.branding);
      } else setMsg({ type: 'err', text: data.error || 'Activation failed.' });
    } catch (err: any) { setMsg({ type: 'err', text: err?.message || 'Server connection failed.' }); }
  };
  const handleSync = async () => {
    setMsg(null);
    try {
      const res = await fetch(getUrl('license/sync'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await res.json();
      setMsg({ type: data.success ? 'ok' : 'err', text: data.message || 'Sync complete.' });
      if (data.state) setState(data.state);
    } catch (err: any) { setMsg({ type: 'err', text: err?.message || 'Sync failed.' }); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="server-card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Server License & Customization</h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>Hardware binding and term activation</p>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {state?.status === 'active' && <Button size="sm" variant="secondary" onClick={handleSync}>Sync Status</Button>}
            <Badge color={state?.status === 'active' ? 'emerald' : state?.status === 'expired' ? 'amber' : 'rose'}>{state?.status?.toUpperCase() || 'UNLICENSED'}</Badge>
          </div>
        </div>
        <div style={{ background: 'var(--color-surface-2)', padding: '10px 14px', borderRadius: 4, marginBottom: 14, border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-subtle)' }}>SERVER HARDWARE ID</div>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem' }}>{state?.hardwareId || 'Computing...'}</span>
          </div>
          <Button size="sm" variant="secondary" onClick={handleCopyHw} icon={copied ? <Check size={14} /> : <Copy size={14} />}>{copied ? 'Copied' : 'Copy'}</Button>
        </div>
        {state?.license && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
            {[['School Name', state.license.branding.schoolName], ['Term & Validity', `${state.license.term} (${state.daysRemaining} days left)`], ['Station Quota', `${state.license.stationLimit} Student Stations`]].map(([lbl, val]) => (
              <div key={lbl} style={{ background: 'var(--color-surface-hover)', padding: '8px 12px', borderRadius: 4 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', display: 'block' }}>{lbl}</span>
                <strong style={{ fontSize: '0.9rem' }}>{val}</strong>
              </div>
            ))}
          </div>
        )}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Activate Server (16-Digit Key or File)</span>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}>
              Load .qznlic File<input type="file" accept=".qznlic,.json" style={{ display: 'none' }} onChange={handleFile} />
            </label>
          </div>
          {msg && <div style={{ padding: '6px 10px', borderRadius: 4, marginBottom: 8, fontSize: '0.8rem', background: msg.type === 'ok' ? '#ecfdf5' : '#fef2f2', color: msg.type === 'ok' ? '#047857' : '#b91c1c' }}>{msg.text}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="XXXX-XXXX-XXXX-XXXX or token" style={{ flex: 1, padding: '8px 10px', fontSize: '0.85rem', fontFamily: 'monospace', borderRadius: 4, border: '1px solid var(--color-border)' }} />
            <Button size="sm" variant="primary" onClick={handleActivate} disabled={!tokenInput.trim()} icon={<LockKey size={14} />}>Activate</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
