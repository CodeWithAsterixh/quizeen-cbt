import React, { useState } from 'react';
import { LicenseState } from '../types/license.js';

interface LicenseLockoutScreenProps {
  licenseState: LicenseState | null;
  onRetry: () => void;
}

const TITLES: Record<string, string> = {
  expired: 'License Expired',
  tampered: 'Security Tamper Lock',
  hardware_mismatch: 'Hardware Mismatch',
  unlicensed: 'System Unlicensed',
};

const MESSAGES: Record<string, string> = {
  expired: 'The current term license has ended. Contact administrator to renew.',
  tampered: 'System clock alteration detected. Access is suspended for integrity.',
  hardware_mismatch: 'Server hardware does not match registered license certificate.',
  unlicensed: 'No active license installed on the Central Server.',
};

export const LicenseLockoutScreen: React.FC<LicenseLockoutScreenProps> = ({
  licenseState,
  onRetry,
}) => {
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
      alignItems: 'center', justifyContent: 'center', background: '#0f172a',
      color: '#f8fafc', padding: 24, fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: 480, width: '100%', background: '#1e293b',
        padding: 32, borderRadius: 12, border: '1px solid #334155', textAlign: 'center'
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: '#7f1d1d',
          color: '#fca5a5', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 20px', fontWeight: 800, fontSize: 24
        }}>!</div>
        <h2 style={{ margin: '0 0 8px', fontSize: 22, color: '#f8fafc' }}>{title}</h2>
        <p style={{ margin: '0 0 20px', color: '#94a3b8', fontSize: 14, lineHeight: 1.5 }}>
          {desc}
        </p>
        <div style={{
          background: '#0f172a', padding: '12px 16px', borderRadius: 8,
          marginBottom: 24, fontSize: 12, textAlign: 'left', border: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Server Hardware ID:</span>
            {hwId && (
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  background: copied ? '#059669' : '#334155',
                  color: '#fff', border: 'none', borderRadius: 4,
                  padding: '2px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer'
                }}
              >
                {copied ? 'Copied' : 'Copy ID'}
              </button>
            )}
          </div>
          <div style={{ fontFamily: 'monospace', color: '#38bdf8', wordBreak: 'break-all', fontWeight: 600, fontSize: 13 }}>
            {hwId || 'Resolving...'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onRetry} style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer'
          }}>
            Check Status Again
          </button>
        </div>
      </div>
    </div>
  );
};
