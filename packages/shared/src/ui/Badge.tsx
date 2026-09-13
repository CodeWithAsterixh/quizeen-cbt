import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  color = 'blue',
  icon,
  className = '',
  children,
  ...props
}) => {
  return (
    <span className={`cbt-badge cbt-badge-${color} ${className}`.trim()} {...props}>
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
