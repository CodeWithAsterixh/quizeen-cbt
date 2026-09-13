import React, { useState, useRef, useEffect, useId } from 'react';

export interface SelectOption { value: string; label: string; description?: string; }
export interface SelectDropdownProps {
  label?: string; options: SelectOption[]; value?: string;
  onChange?: (value: string) => void;
  placeholder?: string; disabled?: boolean; className?: string; id?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label, options, value, onChange, placeholder = 'Select an option', disabled = false, className = '', id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const generatedId = useId();
  const selectId = id || generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelect = (val: string) => {
    if (onChange) onChange(val);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) { setIsOpen(true); setHighlighted(Math.max(0, options.findIndex((o) => o.value === value))); }
      else setHighlighted((p) => (p < options.length - 1 ? p + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) { setIsOpen(true); setHighlighted(Math.max(0, options.findIndex((o) => o.value === value))); }
      else setHighlighted((p) => (p > 0 ? p - 1 : options.length - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen && highlighted >= 0 && highlighted < options.length) handleSelect(options[highlighted].value);
      else setIsOpen(!isOpen);
    } else if (e.key === 'Escape') setIsOpen(false);
  };

  return (
    <div className={`cbt-select-group custom-select-group ${className}`.trim()}>
      {label && <label htmlFor={selectId} className="cbt-input-label form-label">{label}</label>}
      <div className="custom-select-wrapper" ref={containerRef}>
        <button
          id={selectId} type="button" aria-haspopup="listbox" aria-expanded={isOpen}
          className={`custom-select-trigger ${isOpen ? 'open' : ''}`} disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)} onKeyDown={handleKeyDown}
        >
          <span className={selected ? 'custom-select-value' : 'custom-select-placeholder'}>
            {selected ? selected.label : placeholder}
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={`custom-select-arrow ${isOpen ? 'rotated' : ''}`} aria-hidden="true"><polyline points="3 5 7 9 11 5" /></svg>
        </button>

        {isOpen && (
          <ul role="listbox" aria-labelledby={selectId} className="custom-select-dropdown" tabIndex={-1}>
            {options.map((opt, idx) => (
              <li
                key={opt.value} role="option" aria-selected={opt.value === value}
                className={`custom-select-option ${opt.value === value ? 'selected' : ''} ${idx === highlighted ? 'highlighted' : ''}`}
                onClick={() => handleSelect(opt.value)} onMouseEnter={() => setHighlighted(idx)}
              >
                <div style={{ flex: 1 }}>
                  <div>{opt.label}</div>
                  {opt.description && <div className="custom-select-desc">{opt.description}</div>}
                </div>
                {opt.value === value && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--color-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="2.5 7 5.5 10 11.5 4" /></svg>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
