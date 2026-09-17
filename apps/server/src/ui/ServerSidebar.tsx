import React from 'react';
import { Badge, HardDrives, ChartBar, Pulse, Broadcast, LockKey, bakedWhitelabelConfig } from '@cbt/shared';

export type ServerTab = 'overview' | 'devices' | 'license' | 'graph' | 'requests';

interface Props {
  currentTab: ServerTab;
  onSelectTab: (tab: ServerTab) => void;
  requestCount: number;
  isRunning: boolean;
  port: number;
  logoUrl?: string;
}

export const ServerSidebar: React.FC<Props> = ({
  currentTab, onSelectTab, requestCount, isRunning, port, logoUrl,
}) => {
  const items = [
    { id: 'overview' as ServerTab, label: 'Overview', icon: HardDrives },
    { id: 'devices' as ServerTab, label: 'Devices', icon: Broadcast },
    { id: 'license' as ServerTab, label: bakedWhitelabelConfig?.unlicensedMode ? 'Status' : 'License', icon: LockKey },
    { id: 'graph' as ServerTab, label: 'Traffic Graph', icon: ChartBar },
    {
      id: 'requests' as ServerTab,
      label: 'Live',
      icon: Pulse,
      badge: requestCount > 0 ? String(requestCount) : undefined,
    },
  ];

  return (
    <aside className="server-sidebar" aria-label="Server Navigation">
      <nav className="server-sidebar-nav">
        <div style={{ padding: '8px 12px 14px', borderBottom: '1px solid var(--color-border)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          {logoUrl && (
            <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src={logoUrl} alt="Logo" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          )}
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: 0.5 }}>
            CBT SERVER
          </div>
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`server-sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.badge && <Badge color="blue">{item.badge}</Badge>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '12px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
          <div>{isRunning ? 'Listening on' : 'Server is'}</div>
          <strong style={{ color: 'var(--color-text)' }}>{isRunning ? `Port ${port}` : 'Stopped'}</strong>
        </div>
      </div>
    </aside>
  );
};
