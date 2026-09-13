import React, { forwardRef } from 'react';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  value: number | '';
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  helperText?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  error,
  helperText,
  id,
  className = '',
  disabled,
  ...rest
}, ref) => {
  const inputId = id || (label ? `num-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(min !== undefined ? min : 0);
      return;
    }
    const val = Number(raw);
    if (!isNaN(val)) {
      if (max !== undefined && val > max) onChange(max);
      else if (min !== undefined && val < min) onChange(min);
      else onChange(val);
    }
  };

  return (
    <div className="custom-input-group">
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <div className={`custom-input-wrapper ${error ? 'has-error' : ''} ${disabled ? 'disabled' : ''}`}>
        <input
          ref={ref}
          id={inputId}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          className={`custom-input-field ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          {...rest}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
      {!error && helperText && <span className="form-helper">{helperText}</span>}
    </div>
  );
});

NumberInput.displayName = 'NumberInput';
