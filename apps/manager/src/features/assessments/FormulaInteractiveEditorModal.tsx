import React, { useState, useEffect } from 'react';
import { Modal, Button, RichContent, Trash } from '@cbt/shared';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formula: string;
  onSave: (newFormula: string) => void;
  onDelete?: () => void;
}

const QUICK_PARTS = [
  { label: 'Fraction', code: '\\frac{a}{b}' },
  { label: 'Square', code: '^2' },
  { label: 'Subscript', code: '_1' },
  { label: 'Sqrt', code: '\\sqrt{x}' },
  { label: '±', code: '\\pm' },
  { label: 'π', code: '\\pi' },
  { label: 'θ', code: '\\theta' },
  { label: '→', code: '\\rightarrow' },
];

export const FormulaInteractiveEditorModal: React.FC<Props> = ({
  isOpen, onClose, formula, onSave, onDelete,
}) => {
  const [val, setVal] = useState(formula);

  useEffect(() => {
    setVal(formula);
  }, [formula, isOpen]);

  if (!isOpen) return null;

  const handleInsertPart = (part: string) => {
    setVal((prev) => prev + part);
  };

  const handleApply = () => {
    if (val.trim()) onSave(val.trim());
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Formula" maxWidth={560}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '16px', background: 'var(--color-bg)', borderRadius: 8, border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 70 }}>
          <RichContent html={`$${val || '?'}$`} inline={false} style={{ fontSize: '1.25rem' }} />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 6 }}>
            Modify Formula Characters & Variables:
          </label>
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', fontSize: '0.95rem', fontFamily: 'monospace', borderRadius: 4, border: '1px solid var(--color-border)' }}
            placeholder="e.g. X^H X^h or \frac{a}{b}"
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {QUICK_PARTS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handleInsertPart(p.code)}
              style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 4, cursor: 'pointer' }}
            >
              +{p.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
          {onDelete ? (
            <Button variant="danger" size="sm" onClick={() => { onDelete(); onClose(); }} icon={<Trash size={14} />}>
              Remove
            </Button>
          ) : <div />}
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleApply}>Apply Changes</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
