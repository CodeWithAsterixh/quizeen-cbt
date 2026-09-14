import React, { useState, useEffect } from 'react';
import { Broadcast, CheckCircle, XCircle } from '@cbt/shared';
import { Modal, Button, Badge, apiClient } from '@cbt/shared';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Central Server & Network Connection">
      <div style={{ padding: '0.5rem 0' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Specify the central CBT server endpoint for synchronizing assessments and collecting candidate scores.
        </p>

        {discovered && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ecfdf5', padding: '8px 12px', borderRadius: 6, marginBottom: 14 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#047857', fontSize: '0.85rem' }}>
              <Broadcast size={16} /> Discovered server: http://{discovered.ip}:{discovered.port}
            </span>
            <Button size="sm" variant="primary" onClick={() => handleApply(`http://${discovered.ip}:${discovered.port}`)}>
              Use Discovered
            </Button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            value={url}
            onChange={(e) => handleApply(e.target.value)}
            placeholder="http://localhost:4000"
            style={{ flex: 1, padding: '8px 10px', borderRadius: 4, border: '1px solid var(--color-border)', fontSize: '0.875rem' }}
          />
          <Button variant="secondary" onClick={handleTest} disabled={isTesting}>
            {isTesting ? 'Testing...' : 'Test Connection'}
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
