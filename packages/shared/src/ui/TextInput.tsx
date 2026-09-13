import React, { forwardRef } from 'react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  label,
  error,
  helperText,
  icon,
  id,
  className = '',
  ...props
}, ref) => {
  const inputId = id || (label ? `cbt-input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="cbt-input-group">
      {label && (
        <label htmlFor={inputId} className="cbt-input-label">
          {label}
        </label>
      )}
      <div className="cbt-input-wrapper">
        {icon && <span className="cbt-input-icon">{icon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={`cbt-input-field ${icon ? 'with-icon' : ''} ${className}`.trim()}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
      </div>
      {error && <span className="cbt-input-error">{error}</span>}
      {!error && helperText && <span className="cbt-input-helper">{helperText}</span>}
    </div>
  );
});

TextInput.displayName = 'TextInput';
