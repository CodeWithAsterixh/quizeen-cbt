import React, { useState, useEffect } from 'react';
import { Button, Badge, Gear, serverConfig } from '@cbt/shared';

interface Props {
  onOpenServerModal: () => void;
}

export const SettingsServerCard: React.FC<Props> = ({ onOpenServerModal }) => {
  const [currentUrl, setCurrentUrl] = useState(serverConfig.getUrl());
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const check = async () => {
      const res = await serverConfig.testConnection();
      setIsOnline(res.ok);
      setCurrentUrl(serverConfig.getUrl());
    };
    check();
    const handler = () => check();
    window.addEventListener('cbt:server-changed', handler);
    return () => window.removeEventListener('cbt:server-changed', handler);
  }, []);

  return (
    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Server Connection</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
            Connected central server endpoint for assessments and student results.
          </p>
        </div>
        <Button variant="outline" onClick={onOpenServerModal} icon={<Gear size={18} />}>
          Configure Connection
        </Button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--color-bg)', borderRadius: 6 }}>
        <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--color-text)' }}>
          {currentUrl}
        </div>
        <Badge color={isOnline ? 'emerald' : 'rose'}>
          {isOnline ? 'Connected' : 'Offline'}
        </Badge>
      </div>
    </div>
  );
};
