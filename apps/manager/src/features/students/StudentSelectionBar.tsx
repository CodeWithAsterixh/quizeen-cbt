import React from 'react';
import { Button, CaretLeft, CaretRight } from '@cbt/shared';

interface Props {
  isAllSelected: boolean;
  filteredCount: number;
  selectedCount: number;
  onToggleSelectAll: () => void;
  onMoveClass?: (direction: 'next' | 'prev') => void;
}

export const StudentSelectionBar: React.FC<Props> = ({
  isAllSelected,
  filteredCount,
  selectedCount,
  onToggleSelectAll,
  onMoveClass,
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
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={onToggleSelectAll}
          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
        />
        {isAllSelected ? 'Deselect All' : `Select All (${filteredCount})`}
      </label>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          {selectedCount} selected
        </span>
        {selectedCount > 0 && onMoveClass && (
          <>
            <Button size="sm" variant="outline" onClick={() => onMoveClass('prev')} icon={<CaretLeft size={14} />}>
              Move to Previous Class
            </Button>
            <Button size="sm" variant="primary" onClick={() => onMoveClass('next')} icon={<CaretRight size={14} />}>
              Move to Next Class
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
