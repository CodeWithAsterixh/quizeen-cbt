import React, { useState } from 'react';
import { useDiscoveredServers } from '../api/useDiscoveredServers.js';

interface Props { onRetry: () => void; }

export const LockoutServerPicker: React.FC<Props> = ({ onRetry }) => {
  const { servers, activeUrl, connectTo } = useDiscoveredServers();
  const [manualUrl, setManualUrl] = useState(activeUrl);
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = (url: string) => {
    const clean = url.trim().replace(/\/+$/, '');
    if (!clean) return;
    setManualUrl(clean);
    connectTo(clean);
    setTimeout(onRetry, 300);
  };

  const btnStyle = {
    background: 'none', border: 'none', color: 'var(--color-primary, #4d7298)',
    fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0
  };

  return (
    <div style={{ marginTop: 16, borderTop: '1px solid var(--color-border, #d2e3dc)', paddingTop: 14 }}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} style={btnStyle}>
        {isOpen ? 'Hide Server Settings' : 'Connect to a Different Server IP'}
      </button>

      {isOpen && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
          {servers.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-subtle, #77a6b6)', marginBottom: 4 }}>
                Discovered Servers:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {servers.map((s) => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', background: 'var(--color-surface-hover, #f0f7f6)', borderRadius: 4, border: '1px solid var(--color-border, #d2e3dc)', fontSize: 12 }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{s.serverName}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-muted, #4d7298)', marginLeft: 6 }}>{s.url}</span>
                    </div>
                    <button type="button" onClick={() => handleConnect(s.url)} style={{ padding: '2px 8px', fontSize: 11, fontWeight: 600, background: 'var(--color-primary, #4d7298)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-subtle, #77a6b6)', marginBottom: 4 }}>
              Server IP or URL:
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="http://192.168.1.100:4000"
                style={{ flex: 1, padding: '6px 8px', borderRadius: 4, border: '1px solid var(--color-border, #d2e3dc)', fontSize: 12 }}
              />
              <button type="button" onClick={() => handleConnect(manualUrl)} style={{ padding: '6px 12px', fontSize: 12, fontWeight: 600, background: 'var(--color-primary, #4d7298)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
