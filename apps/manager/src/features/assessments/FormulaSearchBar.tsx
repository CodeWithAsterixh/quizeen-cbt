import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlass, X, RichContent } from '@cbt/shared';
import { getFormulaSuggestions } from '@cbt/shared';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  onSelectSnippet: (code: string) => void;
}

export const FormulaSearchBar: React.FC<Props> = ({
  query, onQueryChange, onSelectSnippet,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const suggestions = getFormulaSuggestions(query, 6);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        <MagnifyingGlass size={16} style={{ position: 'absolute', left: 10, color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => { onQueryChange(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(Boolean(query.trim()))}
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          placeholder="Search formulas, symbols, matrices (e.g. frac, alpha, matrix, integral)..."
          style={{
            width: '100%', padding: '7px 32px 7px 32px', fontSize: '0.85rem',
            borderRadius: 6, border: '1px solid var(--color-border)',
            background: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none',
          }}
        />
        {query && (
          <button
            type="button" onClick={() => { onQueryChange(''); setIsOpen(false); }}
            style={{ position: 'absolute', right: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
            title="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 6, zIndex: 100, maxHeight: 220, overflowY: 'auto',
        }}>
          <div style={{ padding: '4px 8px', fontSize: '0.72rem', color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', fontWeight: 600 }}>
            Suggestions (click to insert)
          </div>
          {suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => { onSelectSnippet(item.code); setIsOpen(false); }}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '6px 10px', cursor: 'pointer', borderBottom: '1px solid var(--color-border)',
                fontSize: '0.82rem',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{item.label}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{item.description}</span>
              </div>
              <div style={{ maxWidth: 90, overflow: 'hidden', pointerEvents: 'none' }}>
                <RichContent html={item.code} inline />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
