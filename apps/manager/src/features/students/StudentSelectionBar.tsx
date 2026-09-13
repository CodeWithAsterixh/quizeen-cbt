import React from 'react';

interface Props {
  isAllSelected: boolean;
  filteredCount: number;
  selectedCount: number;
  onToggleSelectAll: () => void;
}

export const StudentSelectionBar: React.FC<Props> = ({
  isAllSelected,
  filteredCount,
  selectedCount,
  onToggleSelectAll,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--color-surface-hover)',
        padding: '8px 14px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
      }}
    >
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={onToggleSelectAll}
          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
        />
        {isAllSelected ? 'Deselect All' : `Select All (${filteredCount})`}
      </label>
      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
        {selectedCount} student{selectedCount === 1 ? '' : 's'} selected
      </div>
    </div>
  );
};
