import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isPill?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  isPill = false,
  icon,
  className = '',
  children,
  ...props
}, ref) => {
  const sizeClass = size === 'sm' ? 'cbt-btn-sm' : size === 'lg' ? 'cbt-btn-lg' : '';
  const pillClass = isPill ? 'cbt-btn-pill' : '';
  const variantClass = `cbt-btn-${variant}`;

  return (
    <button
      ref={ref}
      className={`cbt-btn ${variantClass} ${sizeClass} ${pillClass} ${className}`.trim()}
      {...props}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
