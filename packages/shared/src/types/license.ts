export interface SchoolBrandingConfig {
  schoolName: string;
  appName?: string;
  shortName: string;
  schoolCode: string;
  motto?: string;
  logoUrl?: string;
  appIconUrl?: string;
  watermarkText?: string;
  headerText?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  surfaceMode: 'light' | 'dark' | 'system';
  borderRadius: 'sm' | 'md' | 'lg' | 'full';
  fontPreset: 'inter' | 'system' | 'sans';
}

export interface LicensePayload {
  licenseId: string;
  issuedAt: string;
  validUntil: string;
  term: string;
  hardwareId: string;
  stationLimit: number;
  branding: SchoolBrandingConfig;
  theme: ThemeConfig;
  features?: string[];
}

export interface SignedLicenseToken {
  version: number;
  payload: LicensePayload;
  signature: string;
}

export type LicenseStatus = 'active' | 'expired' | 'tampered' | 'hardware_mismatch' | 'unlicensed';

export interface LicenseState {
  status: LicenseStatus;
  license?: LicensePayload | null;
  hardwareId: string;
  daysRemaining?: number;
  message?: string;
}
