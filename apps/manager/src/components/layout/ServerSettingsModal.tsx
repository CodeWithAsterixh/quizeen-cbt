import React, { useState } from 'react';
import { Broadcast, CheckCircle, XCircle, Modal, Button, Badge, apiClient, useDiscoveredServers } from '@cbt/shared';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Central Server & Network Connection">
      <div style={{ padding: '0.5rem 0' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0 0 10px' }}>
          Active Server: <strong style={{ color: 'var(--color-text)' }}>{activeUrl}</strong>
        </p>

        {servers.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Discovered Servers ({servers.length})
            </div>
            {servers.map((s) => {
              const isConnected = s.url === activeUrl;
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isConnected ? '#ecfdf5' : 'var(--color-surface-2)', padding: '8px 12px', borderRadius: 4, border: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: isConnected ? '#047857' : 'var(--color-text)' }}>
                      <Broadcast size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />{s.serverName}
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

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="http://localhost:4000"
            style={{ flex: 1, padding: '8px 10px', borderRadius: 4, border: '1px solid var(--color-border)', fontSize: '0.875rem' }}
          />
          <Button variant="primary" onClick={() => handleConnect(manualUrl)}>Save</Button>
          <Button variant="secondary" onClick={() => handleTest()} disabled={isTesting}>
            {isTesting ? 'Testing...' : 'Test'}
          </Button>
        </div>

        {testResult && (
          <div style={{ marginBottom: 14 }}>
            {testResult.ok ? (
              <Badge color="emerald"><CheckCircle size={14} /> Server reachable ({testResult.latencyMs}ms)</Badge>
            ) : (
              <Badge color="rose"><XCircle size={14} /> Server unreachable at this address</Badge>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <Button variant="secondary" onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
};
