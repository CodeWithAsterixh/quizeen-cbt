import fs from 'node:fs';
import path from 'node:path';
import { ThemeConfig, DEFAULT_THEME } from '@cbt/shared';
import { resolveDataDir } from '../../core/db/database.js';
import { cryptoLicenseService } from '../license/crypto-license.service.js';

class ThemeService {
  private getThemeFilePath(): string {
    return path.join(resolveDataDir(), 'theme.json');
  }

  public getCustomTheme(): Partial<ThemeConfig> | null {
    const file = this.getThemeFilePath();
    try {
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file, 'utf8');
        return JSON.parse(raw);
      }
    } catch {}
    return null;
  }

  public getTheme(): ThemeConfig {
    const custom = this.getCustomTheme();
    if (custom) {
      return { ...DEFAULT_THEME, ...custom };
    }
    const lic = cryptoLicenseService.getLicenseState();
    if (lic.license?.theme) {
      return { ...DEFAULT_THEME, ...lic.license.theme };
    }
    return DEFAULT_THEME;
  }

  public saveTheme(theme: Partial<ThemeConfig>): ThemeConfig {
    const current = this.getTheme();
    const updated: ThemeConfig = {
      ...current,
      ...theme,
      primaryColor: theme.primaryColor || current.primaryColor,
      accentColor: theme.accentColor || current.accentColor,
    };
    const file = this.getThemeFilePath();
    fs.writeFileSync(file, JSON.stringify(updated, null, 2), 'utf8');
    return updated;
  }
}

export const themeService = new ThemeService();
