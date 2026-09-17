import React from 'react';
import { ThemeConfig } from '@cbt/shared';
import { SettingsSyncCard } from './SettingsSyncCard';
import { SettingsServerCard } from './SettingsServerCard';
import { SettingsThemeCard } from './SettingsThemeCard';

interface Props {
  onSync: () => Promise<void>;
  isSyncing: boolean;
  onOpenServerModal: () => void;
  currentTheme?: ThemeConfig;
  schoolName?: string;
  onNotify: (msg: string) => void;
}

export const ManagerSettingsView: React.FC<Props> = ({
  onSync,
  isSyncing,
  onOpenServerModal,
  currentTheme,
  schoolName,
  onNotify,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 860 }}>
      <header>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>Settings</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: 4 }}>
          Manage server connection, data synchronization, and station theme customization.
        </p>
      </header>

      <SettingsSyncCard onSync={onSync} isSyncing={isSyncing} />
      <SettingsServerCard onOpenServerModal={onOpenServerModal} />
      <SettingsThemeCard currentTheme={currentTheme} schoolName={schoolName} onNotify={onNotify} />
      <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--color-text-muted)', fontSize: '0.82rem', opacity: 0.8 }}>
        Powered by Queez CBT
      </div>
    </div>
  );
};
