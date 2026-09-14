import React, { useState } from 'react';
import { Modal, Button, applyThemeCustomization, resetThemeToDefault, ThemeConfig } from '@cbt/shared';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme?: ThemeConfig;
  schoolName?: string;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen, onClose, currentTheme, schoolName
}) => {
  const [primary, setPrimary] = useState(currentTheme?.primaryColor || '#059669');
  const [accent, setAccent] = useState(currentTheme?.accentColor || '#0d9488');
  const [radius, setRadius] = useState<ThemeConfig['borderRadius']>(currentTheme?.borderRadius || 'md');

  if (!isOpen) return null;

  const handleApply = () => {
    applyThemeCustomization(
      { primaryColor: primary, accentColor: accent, borderRadius: radius, surfaceMode: 'light', fontPreset: 'inter' },
      { schoolName }
    );
  };

  const handleReset = () => {
    resetThemeToDefault();
    setPrimary('#059669');
    setAccent('#0d9488');
    setRadius('md');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="School Theme Preview">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-subtle)' }}>
          Preview how your school colors and corner styling look inside the CBT applications.
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
            Accent Color
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

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
            Corner Radius
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['sm', 'md', 'lg', 'full'] as const).map((r) => (
              <Button
                key={r} size="sm" variant={radius === r ? 'primary' : 'outline'}
                onClick={() => setRadius(r)}
              >
                {r.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <Button variant="ghost" onClick={handleReset}>Reset to Default</Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button variant="primary" onClick={handleApply}>Apply Live Preview</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
