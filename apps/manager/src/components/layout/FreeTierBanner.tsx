import React from 'react';
import { Button, ArrowRight, Sparkle } from '@cbt/shared';

interface Props {
  onOpenUpgrade: () => void;
}

export const FreeTierBanner: React.FC<Props> = ({ onOpenUpgrade }) => {
  return (
    <div style={{
      background: '#fffbeb',
      borderBottom: '1px solid #fde68a',
      padding: '6px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      fontSize: '12px',
      color: '#92400e',
      fontWeight: 500,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          color: '#b45309',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Free Version
        </span>
        <span>
          Running evaluation quota: <strong>1 Student</strong>, <strong>1 Server</strong>, <strong>1 Manager</strong>.
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenUpgrade}
        style={{
          background: '#b45309',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <span>Purchase License</span>
        <ArrowRight size={12} />
      </button>
    </div>
  );
};
