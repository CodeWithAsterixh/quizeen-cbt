import React from 'react';
import {
  Gauge, BookOpen, Users, Archive, ClipboardText, ChartBar, Gear, ArrowsClockwise, MagicWand,
} from '@cbt/shared';
import { Badge, Button } from '@cbt/shared';

export type ManagerTab = 'dashboard' | 'exams' | 'students' | 'compiler' | 'grading' | 'analytics';

interface SidebarProps {
  currentTab: ManagerTab;
  onSelectTab: (tab: ManagerTab) => void;
  onOpenServerSettings: () => void;
  onOpenThemeSettings?: () => void;
  pendingGradingCount: number;
  onRefresh?: () => void;
  isSyncing?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenServerSettings,
  onOpenThemeSettings,
  pendingGradingCount,
  onRefresh,
  isSyncing = false,
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
  ];

  return (
    <aside className="sidebar" aria-label="Teacher & Office Navigation">
      <nav className="sidebar-nav" aria-label="Main manager menu">
        <div style={{ padding: '8px 12px 14px', borderBottom: '1px solid var(--color-border)', marginBottom: 12 }}>
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

      <div style={{ padding: '12px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {onRefresh && (
          <Button variant="ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={onRefresh} disabled={isSyncing}>
            <ArrowsClockwise size={18} className={isSyncing ? 'cbt-spin' : ''} />
            <span style={{
              opacity: isSyncing?0.7:1
            }}>Sync Data</span>
          </Button>
        )}
        <Button variant="ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={onOpenServerSettings}>
          <Gear size={18} />
          <span>Server Connection</span>
        </Button>
        {onOpenThemeSettings && (
          <Button variant="ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={onOpenThemeSettings}>
            <MagicWand size={18} />
            <span>Theme Preview</span>
          </Button>
        )}
      </div>
    </aside>
  );
};
