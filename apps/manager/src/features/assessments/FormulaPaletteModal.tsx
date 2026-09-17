import React, { useState } from 'react';
import { Modal, Button, RichContent } from '@cbt/shared';
import { FORMULA_CATEGORIES, searchFormulaPresets } from './formula-snippets';
import { TableInserterView } from './TableInserterView';
import { FormulaSearchBar } from './FormulaSearchBar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (code: string) => void;
}

export const FormulaPaletteModal: React.FC<Props> = ({ isOpen, onClose, onInsert }) => {
  const [activeTab, setActiveTab] = useState('math');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentCategory = FORMULA_CATEGORIES.find((c) => c.id === activeTab);
  const displayedSnippets = searchQuery.trim()
    ? searchFormulaPresets(searchQuery)
    : (currentCategory?.snippets || []);

  const handleSelect = (code: string) => {
    onInsert(code);
    onClose();
  };

  const tabs = [...FORMULA_CATEGORIES, { id: 'table', name: 'Table Inserter' }];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Equation & Formula Assistant" maxWidth={820}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <FormulaSearchBar query={searchQuery} onQueryChange={setSearchQuery} onSelectSnippet={handleSelect} />

        {!searchQuery.trim() && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
            {tabs.map((cat) => {
              const active = activeTab === cat.id;
              return (
                <button
                  key={cat.id} type="button" onClick={() => setActiveTab(cat.id)}
                  style={{
                    padding: '3px 10px', fontSize: '0.78rem', fontWeight: active ? 700 : 500, borderRadius: 14,
                    border: `1px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: active ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: active ? '#ffffff' : 'var(--color-text)', cursor: 'pointer',
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'table' && !searchQuery.trim() ? (
          <TableInserterView onInsert={handleSelect} />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10, maxHeight: 380, overflowY: 'auto', padding: 2 }}>
            {displayedSnippets.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>
                No formulas matching "{searchQuery}". Try searching for symbols, Greek letters, or math terms.
              </div>
            ) : (
              displayedSnippets.map((snip) => (
                <button
                  key={snip.id || snip.label} type="button" onClick={() => handleSelect(snip.code)}
                  style={{ display: 'flex', flexDirection: 'column', padding: '8px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 6, cursor: 'pointer', textAlign: 'left' }}
                  className="formula-snippet-btn"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>{snip.label}</span>
                    {searchQuery.trim() && <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{snip.category}</span>}
                  </div>
                  <div style={{ fontSize: '0.96rem', margin: '4px 0', minHeight: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <RichContent html={snip.code} inline />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-subtle)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }}>
                    {snip.description}
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 6, borderTop: '1px solid var(--color-border)' }}>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
