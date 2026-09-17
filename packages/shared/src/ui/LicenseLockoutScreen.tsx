import { WarningCircle as WarningIcon } from './icons.js';
import React from 'react';
import { LicenseState } from '../types/license.js';
import { LockoutServerPicker } from './LockoutServerPicker.js';

interface Props { licenseState: LicenseState | null; onRetry: () => void; }

const TITLES: Record<string, string> = {
  expired: 'License Expired', tampered: 'Security Tamper Lock',
  hardware_mismatch: 'Hardware Mismatch', unlicensed: 'System Unlicensed',
};

const MESSAGES: Record<string, string> = {
  expired: 'The current term license has ended. Contact administrator to renew.',
  tampered: 'System clock alteration detected. Access suspended for integrity.',
  hardware_mismatch: 'Server hardware does not match registered license certificate.',
  unlicensed: 'No active license installed on the Central Server.',
};

export const LicenseLockoutScreen: React.FC<Props> = ({ licenseState, onRetry }) => {
  const status = licenseState?.status || 'unlicensed';
  const serverActive = licenseState?.serverOnline;
  const title = TITLES[status] || 'License Inactive';
  const desc = licenseState?.message || MESSAGES[status] || 'License verification failed.';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(28, 44, 58, 0.75)',
      color: 'var(--color-text, #233748)', padding: 24, fontFamily: 'var(--font-family, sans-serif)'
    }}>
      <div style={{
        maxWidth: 460, width: '100%', background: 'var(--color-surface, #ffffff)',
        padding: '28px 24px', borderRadius: 'var(--radius-panel, 10px)',
        border: '1px solid var(--color-border, #d2e3dc)',
        textAlign: 'center'
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          color: 'var(--color-danger, #c94444)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 12px', fontWeight: 800, fontSize: 20
        }}><WarningIcon size={40} weight='duotone'/></div>
        <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--color-text, #233748)' }}>{serverActive?title:"Server Offline"}</h2>
        <p style={{ margin: '0 0 16px', color: 'var(--color-text-muted, #4d7298)', fontSize: 13, lineHeight: 1.5 }}>
          {serverActive?desc:"You are not connected to a server"}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onRetry} style={{
            padding: '8px 20px', borderRadius: 'var(--radius-md, 8px)', border: 'none',
            background: 'var(--color-primary, #4d7298)', color: 'var(--color-primary-content, #ffffff)',
            fontWeight: 600, fontSize: 12, cursor: 'pointer'
          }}>
            Check Status Again
          </button>
        </div>
        <LockoutServerPicker onRetry={onRetry} />
      </div>
    </div>
  );
};
