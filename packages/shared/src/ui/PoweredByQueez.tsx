import React, { useState } from 'react';
import { bakedWhitelabelConfig } from '../whitelabel-data.js';

export interface PoweredByQueezProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  textColor?: string;
  logoSrc?: string;
  isWhitelabel?: boolean;
}

export const PoweredByQueez: React.FC<PoweredByQueezProps> = ({
  className,
  style,
  size = 14,
  textColor,
  logoSrc = '/icon.png',
  isWhitelabel,
}) => {
  const [src, setSrc] = useState(logoSrc);
  const [failed, setFailed] = useState(false);

  const isWl = isWhitelabel ?? Boolean(bakedWhitelabelConfig?.isWhitelabel);
  if (isWl) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.72rem',
        color: textColor || 'var(--color-text-subtle, var(--color-text-muted, #64748b))',
        userSelect: 'none',
        ...style,
      }}
    >
      {!failed && (
        <img
          src={src}
          alt="Queez Logo"
          width={size}
          height={size}
          onError={() => {
            if (src !== './icon.png') setSrc('./icon.png');
            else setFailed(true);
          }}
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            borderRadius: 3,
            flexShrink: 0,
          }}
        />
      )}
      <span style={{ fontWeight: 500, letterSpacing: '0.01em' }}>
        Powered by Queez CBT Suite
      </span>
    </div>
  );
};
