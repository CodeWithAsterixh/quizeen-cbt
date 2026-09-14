import React, { useState } from 'react';
import { Broadcast, CheckCircle, XCircle, Button, Badge, apiClient, useDiscoveredServers } from '@cbt/shared';

export const ServerConnectionConfig: React.FC = () => {
  const { servers, activeUrl, connectTo } = useDiscoveredServers();
  const [manualUrl, setManualUrl] = useState(activeUrl);
  const [testResult, setTestResult] = useState<{ ok: boolean; latencyMs: number } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async (target?: string) => {
    setIsTesting(true);
    const res = await apiClient.testConnection(target || manualUrl);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleConnect = (url: string) => {
    setManualUrl(url);
    connectTo(url);
    handleTest(url);
  };

  return (
    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14, marginBottom: 14 }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6 }}>Network Server Connection</h3>
      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', marginBottom: 8 }}>
        Active: <strong style={{ color: 'var(--color-text)' }}>{activeUrl}</strong>
      </div>

      {servers.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Discovered Servers ({servers.length})
          </div>
          {servers.map((s) => {
            const isConnected = s.url === activeUrl;
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isConnected ? '#ecfdf5' : 'var(--color-surface-2)', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--color-border)', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, color: isConnected ? '#047857' : 'var(--color-text)' }}>
                    <Broadcast size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />{s.serverName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontFamily: 'monospace' }}>{s.url}</span>
                </div>
                {isConnected ? (
                  <Badge color="emerald">Active</Badge>
                ) : (
                  <Button size="sm" variant="primary" onClick={() => handleConnect(s.url)}>Connect</Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <input
          type="text"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="http://192.168.1.100:4000"
          style={{ flex: 1, padding: '6px 8px', borderRadius: 4, border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
        />
        <Button size="sm" variant="primary" onClick={() => handleConnect(manualUrl)}>Save</Button>
        <Button size="sm" variant="secondary" onClick={() => handleTest()} disabled={isTesting}>
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
