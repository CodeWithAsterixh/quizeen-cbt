import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'none';
  isInteractive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  accent = 'none',
  isInteractive = false,
  className = '',
  children,
  ...props
}) => {
  const accentClass = accent !== 'none' ? `cbt-card-accent-${accent}` : '';
  const interactiveClass = isInteractive ? 'cbt-card-interactive' : '';

  return (
    <div className={`cbt-card ${accentClass} ${interactiveClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};
