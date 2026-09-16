import React, { useState } from 'react';
import { Modal, Button, applyThemeCustomization, resetThemeToDefault, ThemeConfig, apiClient } from '@cbt/shared';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: ThemeConfig;
  schoolName?: string;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen, onClose, currentTheme, schoolName,
}) => {
  const [primary, setPrimary] = useState(currentTheme?.primaryColor || '#059669');
  const [accent, setAccent] = useState(currentTheme?.accentColor || '#0d9488');

  if (!isOpen) return null;

  const handleApply = () => {
    applyThemeCustomization(
      { primaryColor: primary, accentColor: accent, surfaceMode: 'light', fontPreset: 'inter' },
      { schoolName }
    );
  };

  const handleSave = async () => {
    handleApply();
    await apiClient.saveTheme({ primaryColor: primary, accentColor: accent });
    onClose();
  };

  const handleReset = () => {
    resetThemeToDefault();
    setPrimary('#059669');
    setAccent('#0d9488');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="School Theme Preview">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-subtle)' }}>
          Select your primary and secondary school colors. The dynamic WCAG engine algorithmically derives all surfaces, text contrast, and semantic colors.
        </p>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
            Primary Color
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="color" value={primary} onChange={(e) => setPrimary(e.target.value)}
              style={{ width: 40, height: 36, border: 'none', cursor: 'pointer', borderRadius: 6 }}
            />
            <input
              type="text" value={primary} onChange={(e) => setPrimary(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 6 }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
            Secondary Accent Color
          </label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="color" value={accent} onChange={(e) => setAccent(e.target.value)}
              style={{ width: 40, height: 36, border: 'none', cursor: 'pointer', borderRadius: 6 }}
            />
            <input
              type="text" value={accent} onChange={(e) => setAccent(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 6 }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
          <Button variant="ghost" onClick={handleReset}>Reset to Default</Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button variant="outline" onClick={handleApply}>Preview</Button>
            <Button variant="primary" onClick={handleSave}>Save to All Stations</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
