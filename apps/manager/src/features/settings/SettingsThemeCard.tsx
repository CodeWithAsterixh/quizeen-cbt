import React, { useState } from 'react';
import { Button, applyThemeCustomization, resetThemeToDefault, DEFAULT_THEME, ThemeConfig, apiClient } from '@cbt/shared';

interface Props {
  currentTheme?: ThemeConfig;
  schoolName?: string;
  onNotify: (msg: string) => void;
}

export const SettingsThemeCard: React.FC<Props> = ({ currentTheme, schoolName, onNotify }) => {
  const [primary, setPrimary] = useState(currentTheme?.primaryColor || DEFAULT_THEME.primaryColor);
  const [accent, setAccent] = useState(currentTheme?.accentColor || DEFAULT_THEME.accentColor);
  const [isSaving, setIsSaving] = useState(false);

  const handlePreview = () => {
    applyThemeCustomization({ primaryColor: primary, accentColor: accent, surfaceMode: 'light', fontPreset: 'inter' }, { schoolName });
    onNotify('Applied live theme preview locally.');
  };

  const handleSaveToAll = async () => {
    setIsSaving(true);
    try {
      applyThemeCustomization({ primaryColor: primary, accentColor: accent, surfaceMode: 'light', fontPreset: 'inter' }, { schoolName });
      const res = await apiClient.saveTheme({ primaryColor: primary, accentColor: accent });
      onNotify(res.success ? 'Theme saved and broadcast to Server, Student, and Manager stations.' : (res.error || 'Failed to save theme to server.'));
    } catch {
      onNotify('Could not reach server to save theme.');
    } finally { setIsSaving(false); }
  };

  const handleReset = () => {
    resetThemeToDefault(); setPrimary(DEFAULT_THEME.primaryColor); setAccent(DEFAULT_THEME.accentColor);
    onNotify('Theme reset to default.');
  };

  return (
    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>School Theme & Colors</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
          Customize branding colors. The dynamic WCAG engine algorithmically derives all surfaces and text contrast.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>
            Primary Color
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="color" value={primary} onChange={(e) => setPrimary(e.target.value)}
              style={{ width: 42, height: 36, border: 'none', cursor: 'pointer', borderRadius: 6 }}
            />
            <input
              type="text" value={primary} onChange={(e) => setPrimary(e.target.value)}
              style={{ flex: 1, padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 6, fontFamily: 'monospace' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>
            Secondary Accent Color
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="color" value={accent} onChange={(e) => setAccent(e.target.value)}
              style={{ width: 42, height: 36, border: 'none', cursor: 'pointer', borderRadius: 6 }}
            />
            <input
              type="text" value={accent} onChange={(e) => setAccent(e.target.value)}
              style={{ flex: 1, padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 6, fontFamily: 'monospace' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--color-border)', flexWrap: 'wrap', gap: 10 }}>
        <Button variant="ghost" onClick={handleReset}>Reset to Default</Button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" onClick={handlePreview}>Preview Theme</Button>
          <Button variant="primary" onClick={handleSaveToAll} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save to All Stations'}
          </Button>
        </div>
      </div>
    </div>
  );
};
