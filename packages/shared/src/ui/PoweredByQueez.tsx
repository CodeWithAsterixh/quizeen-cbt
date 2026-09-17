import React from 'react';
import { bakedWhitelabelConfig } from '../whitelabel-data.js';
import { QueezLogo } from './QueezLogo.js';

export interface PoweredByQueezProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  textColor?: string;
  logoSrc?: string;
  isWhitelabel?: boolean;
  layout?: 'stacked' | 'inline';
}

export const PoweredByQueez: React.FC<PoweredByQueezProps> = ({
  className,
  style,
  size = 30,
  textColor,
  logoSrc,
  isWhitelabel,
  layout = 'stacked',
}) => {
  const isWl = isWhitelabel ?? Boolean(bakedWhitelabelConfig?.isWhitelabel);
  if (isWl) {
    return null;
  }

  const logoWidth = Math.round((size * 230) / 355);

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        fontSize: '0.78rem',
        color: textColor || 'var(--color-text-muted, #4d7298)',
        userSelect: 'none',
        ...style,
      }}
    >
      {logoSrc ? (
        <img
          src={logoSrc}
          alt="Queez Logo"
          width={logoWidth}
          height={size}
          style={{ width: logoWidth, height: size, objectFit: 'contain', flexShrink: 0 }}
        />
      ) : (
        <QueezLogo size={size} />
      )}
      {layout === 'inline' ? (
        <span style={{ fontWeight: 600, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
          Powered by Queez CBT Suite
        </span>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, textAlign: 'left' }}>
          <span
            style={{
              fontSize: '0.62rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 600,
              opacity: 0.75,
              whiteSpace: 'nowrap',
            }}
          >
            Powered by
          </span>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: textColor || 'var(--color-primary, #4d7298)',
              whiteSpace: 'nowrap',
            }}
          >
            Queez CBT Suite
          </span>
        </div>
      )}
    </div>
  );
};
