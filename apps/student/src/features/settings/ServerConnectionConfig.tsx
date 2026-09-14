import React, { useState, useEffect } from 'react';
import { Broadcast, CheckCircle, XCircle } from '@cbt/shared';
import { Button, Badge, apiClient } from '@cbt/shared';

export const ServerConnectionConfig: React.FC = () => {
  const [url, setUrl] = useState(apiClient.getServerUrl());
  const [discovered, setDiscovered] = useState<{ ip: string; port: number } | null>(null);
  const [testResult, setTestResult] = useState<{ ok: boolean; latencyMs: number } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const electron = (window as any).electronApi;
    if (electron?.onServerDiscovered) {
      return electron.onServerDiscovered((data: { ip: string; port: number }) => {
        setDiscovered(data);
      });
    }
  }, []);

  const handleTest = async () => {
    setIsTesting(true);
    const res = await apiClient.testConnection(url);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleApply = (newUrl: string) => {
    setUrl(newUrl);
    apiClient.setServerUrl(newUrl);
    setTestResult(null);
  };

  return (
    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14, marginBottom: 14 }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6, color: 'var(--color-text)' }}>Network Server Connection</h3>
      {discovered && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ecfdf5', padding: '6px 10px', borderRadius: 4, marginBottom: 8, fontSize: '0.8rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#047857' }}>
            <Broadcast size={14} /> Found Server: http://{discovered.ip}:{discovered.port}
          </span>
          <button style={{ border: 'none', background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: 3, cursor: 'pointer', fontSize: '0.75rem' }} onClick={() => handleApply(`http://${discovered.ip}:${discovered.port}`)}>
            Connect
          </button>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <input
          type="text"
          value={url}
          onChange={(e) => handleApply(e.target.value)}
          placeholder="http://192.168.1.100:4000"
          style={{ flex: 1, padding: '6px 8px', borderRadius: 4, border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
        />
        <Button size="sm" variant="secondary" onClick={handleTest} disabled={isTesting}>
          {isTesting ? 'Testing...' : 'Test'}
        </Button>
      </div>
      {testResult && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
          {testResult.ok ? (
            <Badge color="emerald"><CheckCircle size={14} /> Connected ({testResult.latencyMs}ms)</Badge>
          ) : (
            <Badge color="rose"><XCircle size={14} /> Server unreachable</Badge>
          )}
        </div>
      )}
    </div>
  );
};
