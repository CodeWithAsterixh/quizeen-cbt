import React, { useState } from 'react';
import { Modal, Button, RichContent } from '@cbt/shared';
import { FORMULA_CATEGORIES } from './formula-snippets';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (code: string) => void;
}

export const FormulaPaletteModal: React.FC<Props> = ({ isOpen, onClose, onInsert }) => {
  const [activeTab, setActiveTab] = useState('math');

  if (!isOpen) return null;

  const currentCategory = FORMULA_CATEGORIES.find((c) => c.id === activeTab) || FORMULA_CATEGORIES[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Equation & Formula Assistant" maxWidth={680}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--color-border)', paddingBottom: 8, overflowX: 'auto' }}>
          {FORMULA_CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={activeTab === cat.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Click any formula or table template to insert it into the question prompt.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, maxHeight: 320, overflowY: 'auto', padding: 4 }}>
          {currentCategory.snippets.map((snip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { onInsert(snip.code); onClose(); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '10px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                borderRadius: 6, cursor: 'pointer', textAlign: 'left', transition: 'all 120ms ease',
              }}
              className="formula-snippet-btn"
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>
                {snip.label}
              </span>
              <div style={{ fontSize: '0.95rem', margin: '4px 0', minHeight: 28, display: 'flex', alignItems: 'center' }}>
                <RichContent html={snip.code} inline />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-subtle)' }}>
                {snip.description}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
