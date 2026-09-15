import React, { useState } from 'react';
import { LicenseState } from '../types/license.js';

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
  const [copied, setCopied] = useState(false);
  const status = licenseState?.status || 'unlicensed';
  const title = TITLES[status] || 'License Inactive';
  const desc = licenseState?.message || MESSAGES[status] || 'License verification failed.';
  const hwId = licenseState?.hardwareId || '';

  const handleCopy = () => {
    if (!hwId) return;
    navigator.clipboard.writeText(hwId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'rgba(35, 55, 72, 0.45)', backdropFilter: 'blur(6px)',
      color: 'var(--color-text, #233748)', padding: 24, fontFamily: 'var(--font-family, sans-serif)'
    }}>
      <div style={{
        maxWidth: 460, width: '100%', background: 'var(--color-surface, #ffffff)',
        padding: '32px 28px', borderRadius: 'var(--radius-panel, 10px)',
        border: '1px solid var(--color-border, #d2e3dc)',
        boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(77, 114, 152, 0.1))', textAlign: 'center'
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', background: 'var(--color-danger-light, #fad6d6)',
          color: 'var(--color-danger, #c94444)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800, fontSize: 22
        }}>!</div>
        <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: 'var(--color-text, #233748)' }}>{title}</h2>
        <p style={{ margin: '0 0 20px', color: 'var(--color-text-muted, #4d7298)', fontSize: 13, lineHeight: 1.5 }}>
          {desc}
        </p>
        <div style={{
          background: 'var(--color-surface-hover, #f0f7f6)', padding: '12px 14px', borderRadius: 'var(--radius-md, 8px)',
          marginBottom: 24, fontSize: 12, textAlign: 'left', border: '1px solid var(--color-border, #d2e3dc)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ color: 'var(--color-text-subtle, #77a6b6)', fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}>
              SERVER HARDWARE ID
            </span>
            {hwId && (
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  background: copied ? 'var(--color-success, #55913e)' : 'var(--color-surface, #ffffff)',
                  color: copied ? '#ffffff' : 'var(--color-primary, #4d7298)',
                  border: '1px solid var(--color-border, #d2e3dc)', borderRadius: 'var(--radius-sm, 4px)',
                  padding: '3px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer'
                }}
              >
                {copied ? 'Copied' : 'Copy ID'}
              </button>
            )}
          </div>
          <div style={{ fontFamily: 'monospace', color: 'var(--color-primary, #4d7298)', wordBreak: 'break-all', fontWeight: 700, fontSize: 13 }}>
            {hwId || 'Resolving...'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onRetry} style={{
            padding: '10px 24px', borderRadius: 'var(--radius-md, 8px)', border: 'none',
            background: 'var(--color-primary, #4d7298)', color: 'var(--color-primary-content, #ffffff)',
            fontWeight: 600, fontSize: 13, cursor: 'pointer'
          }}>
            Check Status Again
          </button>
        </div>
      </div>
    </div>
  );
};
