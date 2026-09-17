export interface WhitelabelConfig {
  isWhitelabel: boolean;
  unlicensedMode?: boolean;
  suiteName?: string;
  schoolName?: string;
  shortName?: string;
  brandingText?: string;
  serverName?: string;
  managerName?: string;
  studentName?: string;
  primaryColor?: string;
  accentColor?: string;
  iconPath?: string;
  appIconUrl?: string;
  logo?: string;
  badges?: { server?: string; manager?: string; student?: string; uninstall?: string; installer?: string };
  badgeColors?: { server?: string; manager?: string; student?: string; uninstall?: string; installer?: string };
  version?: string;
  isDryRun?: boolean;
  [key: string]: any;
}
