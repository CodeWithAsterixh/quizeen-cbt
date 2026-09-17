import React from 'react';
import {
  Gauge, BookOpen, Users, Archive, ClipboardText, ChartBar, Gear,
} from '@cbt/shared';
import { Badge, Button, PoweredByQueez, bakedWhitelabelConfig } from '@cbt/shared';

export type ManagerTab = 'dashboard' | 'exams' | 'students' | 'compiler' | 'grading' | 'analytics' | 'settings';

interface SidebarProps {
  currentTab: ManagerTab;
  onSelectTab: (tab: ManagerTab) => void;
  pendingGradingCount: number;
  logoUrl?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingGradingCount,
  logoUrl,
}) => {
  const navItems = [
    { id: 'dashboard' as ManagerTab, label: 'Overview', icon: Gauge },
    { id: 'exams' as ManagerTab, label: 'Assessments', icon: BookOpen },
    { id: 'students' as ManagerTab, label: 'Students', icon: Users },
    { id: 'compiler' as ManagerTab, label: 'Compile Assessments', icon: Archive },
    {
      id: 'grading' as ManagerTab,
      label: 'Mark Student Answers',
      icon: ClipboardText,
      badge: pendingGradingCount > 0 ? `${pendingGradingCount} to mark` : undefined,
    },
    { id: 'analytics' as ManagerTab, label: 'Results & Scores', icon: ChartBar },
    { id: 'settings' as ManagerTab, label: 'Settings', icon: Gear },
  ];

  return (
    <aside className="sidebar" aria-label="Teacher & Office Navigation">
      <nav className="sidebar-nav" aria-label="Main manager menu">
        <div style={{ padding: '8px 12px 14px', borderBottom: '1px solid var(--color-border)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          {logoUrl && (
            <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden',  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img src={logoUrl} alt="Logo" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          )}
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: 0.5 }}>
            ASSESSMENT MANAGER
          </div>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
              <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.badge && <Badge color="amber">{item.badge}</Badge>}
            </Button>
          );
        })}
      </nav>
      {!bakedWhitelabelConfig?.isWhitelabel && (
        <div style={{ padding: '12px 4px 2px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'center' }}>
          <PoweredByQueez size={30} />
        </div>
      )}
    </aside>
  );
};
