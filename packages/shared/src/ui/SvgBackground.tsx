import React, { Children, cloneElement, isValidElement } from 'react';

export interface SvgBackgroundProps {
  children: React.ReactNode;
  fill?: boolean;
  width?: string | number;
  height?: string | number;
  opacity?: number;
  preserveAspectRatio?: string;
  pointerEvents?: boolean;
  zIndex?: number;
  className?: string;
  ariaHidden?: boolean;
}

/**
 * SvgBackground component.
 * Positions and scales passed SVG children to fill container width and height.
 */
export const SvgBackground: React.FC<SvgBackgroundProps> = ({
  children,
  fill = true,
  width,
  height,
  opacity,
  preserveAspectRatio = 'xMidYMid slice',
  pointerEvents = false,
  zIndex = 0,
  className = '',
  ariaHidden = true,
}) => {
  const containerStyle: React.CSSProperties = {
    ...(fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : {}),
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(opacity !== undefined ? { opacity } : {}),
    pointerEvents: pointerEvents ? 'auto' : 'none',
    zIndex,
    overflow: 'hidden',
  };

  const renderChildren = () => {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) return child;

      if (typeof child.type === 'string' && child.type.toLowerCase() === 'svg') {
        const existingClass = (child.props as any).className || '';
        return cloneElement(child as React.ReactElement<any>, {
          width: '100%',
          height: '100%',
          preserveAspectRatio: (child.props as any).preserveAspectRatio || preserveAspectRatio,
          className: `${existingClass} w-full h-full block`.trim(),
          'aria-hidden': ariaHidden ? 'true' : undefined,
        });
      }

      return child;
    });
  };

  return (
    <div
      aria-hidden={ariaHidden ? 'true' : undefined}
      className={`svg-background ${className}`.trim()}
      style={containerStyle}
    >
      {renderChildren()}
    </div>
  );
};
