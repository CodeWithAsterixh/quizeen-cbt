import { ThemeConfig, SchoolBrandingConfig } from '../types/license.js';

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#059669',
  accentColor: '#0d9488',
  surfaceMode: 'light',
  borderRadius: 'md',
  fontPreset: 'inter',
};

const RADIUS_MAP: Record<ThemeConfig['borderRadius'], string> = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
};

export function applyThemeCustomization(
  theme?: Partial<ThemeConfig> | null,
  branding?: Partial<SchoolBrandingConfig> | null
): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const activeTheme = { ...DEFAULT_THEME, ...theme };

  root.style.setProperty('--color-primary', activeTheme.primaryColor);
  root.style.setProperty('--color-primary-hover', activeTheme.primaryColor + 'ee');
  root.style.setProperty('--color-primary-subtle', activeTheme.primaryColor + '18');
  root.style.setProperty('--color-accent', activeTheme.accentColor);
  root.style.setProperty('--radius-md', RADIUS_MAP[activeTheme.borderRadius] || '8px');

  if (branding?.schoolName) {
    root.style.setProperty('--school-name', `"${branding.schoolName}"`);
  }
}

export function resetThemeToDefault(): void {
  applyThemeCustomization(DEFAULT_THEME, null);
}
