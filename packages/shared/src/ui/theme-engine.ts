import { ThemeConfig, SchoolBrandingConfig } from '../types/license.js';
import { applyColorPalette } from './color-palette-engine.js';

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#059669',
  accentColor: '#0d9488',
  surfaceMode: 'light',
  borderRadius: 'md',
  fontPreset: 'inter',
};

export function applyThemeCustomization(
  theme?: Partial<ThemeConfig> | null,
  branding?: Partial<SchoolBrandingConfig> | null
): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const activeTheme = { ...DEFAULT_THEME, ...theme };

  applyColorPalette(activeTheme.primaryColor, activeTheme.accentColor);

  if (branding?.schoolName) {
    root.style.setProperty('--school-name', `"${branding.schoolName}"`);
  }
  if (branding?.appName) {
    root.style.setProperty('--app-name', `"${branding.appName}"`);
    document.title = branding.appName;
  } else if (branding?.schoolName) {
    document.title = `${branding.schoolName} CBT Platform`;
  }
  const logo = branding?.appIconUrl || branding?.logoUrl;
  if (logo) {
    root.style.setProperty('--school-logo', `url("${logo}")`);
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = logo;
  }
}

export function resetThemeToDefault(): void {
  applyThemeCustomization(DEFAULT_THEME, null);
}
