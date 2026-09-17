import React, { useState, useRef, useEffect } from 'react';
import { NIGERIAN_SUBJECTS } from '../data/subjects.js';

export interface SubjectInputProps {
  label?: string; value: string; onChangeValue: (val: string) => void;
  placeholder?: string; style?: React.CSSProperties; className?: string;
  required?: boolean; subjects?: string[]; icon?: React.ReactNode;
}

export const SubjectInput: React.FC<SubjectInputProps> = ({
  label, value, onChangeValue, placeholder = 'e.g. Mathematics, English Language...',
  style, className, required, subjects = NIGERIAN_SUBJECTS, icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = value.trim()
    ? subjects.filter((s) => s.toLowerCase().includes(value.trim().toLowerCase())).slice(0, 10)
    : subjects.slice(0, 8);

  useEffect(() => {
    const handleOut = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOut);
    return () => document.removeEventListener('mousedown', handleOut);
  }, []);

  const selectItem = (sub: string) => {
    onChangeValue(sub); setIsOpen(false); setHighlightIdx(-1);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key === 'ArrowDown') { setIsOpen(true); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault(); setHighlightIdx((p) => (p + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setHighlightIdx((p) => (p <= 0 ? filtered.length - 1 : p - 1));
    } else if (e.key === 'Enter' && highlightIdx >= 0 && filtered[highlightIdx]) {
      e.preventDefault(); selectItem(filtered[highlightIdx]);
    } else if (e.key === 'Escape') setIsOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', ...style }}>
      {label && <label className="cbt-input-label">{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && <span style={{ position: 'absolute', left: 10, display: 'flex', pointerEvents: 'none', color: 'var(--color-text-muted)' }}>{icon}</span>}
        <input
          type="text" value={value}
          onChange={(e) => { onChangeValue(e.target.value); setIsOpen(true); setHighlightIdx(-1); }}
          onFocus={() => setIsOpen(true)} onKeyDown={handleKey} placeholder={placeholder}
          className={className} required={required} autoComplete="off"
          style={{
            width: '100%', padding: icon ? '7px 10px 7px 34px' : '7px 10px',
            borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)',
            color: 'var(--color-text)', fontSize: '0.88rem', fontWeight: 500, outline: 'none',
          }}
        />
      </div>
      {isOpen && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 8, maxHeight: 210,
          overflowY: 'auto', zIndex: 1100,
        }}>
          {filtered.map((sub, i) => (
            <div
              key={sub}
              onMouseDown={(e) => { e.preventDefault(); selectItem(sub); }}
              onMouseEnter={() => setHighlightIdx(i)}
              style={{
                padding: '8px 12px', fontSize: '0.86rem', cursor: 'pointer',
                background: highlightIdx === i ? 'var(--color-surface-hover, rgba(0,0,0,0.05))' : 'transparent',
                color: highlightIdx === i ? 'var(--color-primary)' : 'var(--color-text)',
                fontWeight: sub.toLowerCase() === value.trim().toLowerCase() ? 700 : 400,
              }}
            >
              {sub}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
