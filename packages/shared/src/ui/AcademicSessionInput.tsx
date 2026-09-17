import React, { useState, useEffect, useRef } from 'react';

export interface AcademicSessionInputProps {
  value?: string;
  onChange?: (val: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const AcademicSessionInput: React.FC<AcademicSessionInputProps> = ({
  value = '', onChange, label = 'Academic Session', error, helperText, required, disabled, className = '',
}) => {
  const [start, setStart] = useState(() => (value || '').split('/')[0] || '');
  const [end, setEnd] = useState(() => (value || '').split('/')[1] || '');
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const parts = (value || '').split('/');
    setStart(parts[0] || '');
    setEnd(parts[1] || '');
  }, [value]);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setStart(raw);
    let nextEnd = end;
    if (raw.length === 4) {
      if (!end || end.length < 4) {
        nextEnd = String(Number(raw) + 1);
        setEnd(nextEnd);
      }
      endRef.current?.focus();
      endRef.current?.select();
    }
    onChange?.(raw ? `${raw}/${nextEnd}` : '');
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setEnd(raw);
    onChange?.(start ? `${start}/${raw}` : raw ? `/${raw}` : '');
  };

  const handleEndKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !end) startRef.current?.focus();
  };

  const inputStyle: React.CSSProperties = { textAlign: 'center', width: '100%', padding: '0.55rem 4px', fontVariantNumeric: 'tabular-nums' };

  return (
    <div className={`cbt-input-group ${className}`.trim()}>
      {label && <label className="cbt-input-label">{label}{required && <span style={{ color: 'var(--color-danger)', marginLeft: 3 }}>*</span>}</label>}
      <div className={`cbt-input-wrapper ${error ? 'has-error' : ''}`} style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
        <input ref={startRef} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4} placeholder="YYYY" value={start} onChange={handleStartChange} disabled={disabled} className="cbt-input-field" style={inputStyle} />
        <span style={{ fontWeight: 800, color: 'var(--color-text-muted)', userSelect: 'none', padding: '0 4px', fontSize: '1rem' }}>/</span>
        <input ref={endRef} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4} placeholder="YYYY" value={end} onChange={handleEndChange} onKeyDown={handleEndKeyDown} disabled={disabled} className="cbt-input-field" style={inputStyle} />
      </div>
      {error && <span className="cbt-input-error">{error}</span>}
      {!error && helperText && <span className="cbt-input-helper">{helperText}</span>}
    </div>
  );
};
