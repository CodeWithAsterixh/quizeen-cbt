import React, { useRef, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
  disabled?: boolean;
}

export const OtpCodeInput: React.FC<Props> = ({ value, onChange, onComplete, disabled }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const chars = Array.from({ length: 6 }, (_, i) => value[i] || '');

  useEffect(() => {
    if (!disabled && inputsRef.current[0]) inputsRef.current[0].focus();
  }, [disabled]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !chars[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!raw) {
      const next = chars.map((c, i) => (i === index ? '' : c)).join('');
      return onChange(next);
    }
    const newChars = [...chars];
    newChars[index] = raw[raw.length - 1];
    const nextVal = newChars.join('');
    onChange(nextVal);
    if (index < 5) inputsRef.current[index + 1]?.focus();
    if (nextVal.length === 6 && onComplete) onComplete(nextVal);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
    onChange(pasted);
    const targetIdx = Math.min(pasted.length, 5);
    inputsRef.current[targetIdx]?.focus();
    if (pasted.length === 6 && onComplete) onComplete(pasted);
  };

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '14px 0' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          maxLength={1}
          value={chars[i] || ''}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          data-form-type="other"
          data-lpignore="true"
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 46, height: 56, fontSize: '1.5rem', fontWeight: 700,
            textAlign: 'center', textTransform: 'uppercase', fontFamily: 'monospace',
            borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)',
            background: chars[i] ? 'var(--color-surface)' : 'var(--color-bg)',
            color: 'var(--color-primary)', outline: 'none', transition: 'all 120ms ease',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; }}
        />
      ))}
    </div>
  );
};
