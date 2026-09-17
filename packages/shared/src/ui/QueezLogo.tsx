import React from 'react';

export interface QueezLogoProps {
  size?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export const QueezLogo: React.FC<QueezLogoProps> = ({
  size = 30,
  width,
  height,
  className,
  style,
  color,
}) => {
  const gradientId = React.useId ? React.useId().replace(/:/g, '') : 'queez-brand-grad';
  const strokeColor = color || `url(#${gradientId})`;
  const fillColor = color || `url(#${gradientId})`;

  const svgHeight = height ?? size;
  const svgWidth = width ?? (typeof svgHeight === 'number' ? Math.round((svgHeight * 230) / 355) : svgHeight);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="135 65 230 355"
      width={svgWidth}
      height={svgHeight}
      fill="none"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      aria-label="Queez Logo"
      role="img"
    >
      {!color && (
        <defs>
          <linearGradient id={gradientId} x1="20%" y1="5%" x2="80%" y2="95%">
            <stop offset="0%" stopColor="var(--color-secondary, #77a6b6)" />
            <stop offset="45%" stopColor="var(--color-primary, #4d7298)" />
            <stop offset="100%" stopColor="var(--color-text, #233748)" />
          </linearGradient>
        </defs>
      )}

      {/* Outer Circle (Q head) */}
      <circle cx="250" cy="180" r="98" stroke={strokeColor} strokeWidth="26" strokeLinecap="round" />

      {/* Inner Hook (? top) sweeping down into right diagonal */}
      <path
        d="M 198 190 A 52 52 0 0 1 302 180 C 302 210 290 236 274 262 L 222 344"
        stroke={strokeColor}
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* The Z: top bar, left diagonal, and bottom bar */}
      <path
        d="M 192 236 L 244 236 L 178 344 L 322 344"
        stroke={strokeColor}
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Q Tail: sweeping out to the right */}
      <path
        d="M 270 262 C 294 282 324 286 350 278"
        stroke={strokeColor}
        strokeWidth="26"
        strokeLinecap="round"
      />

      {/* ? Dot: centered beneath the bottom bar of Z */}
      <circle cx="250" cy="396" r="18" fill={fillColor} />
    </svg>
  );
};
