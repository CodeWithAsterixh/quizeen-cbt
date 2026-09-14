import React from 'react';
import { UserPlus, Printer, Key } from '@cbt/shared';
import { Button } from '@cbt/shared';

interface Props {
  selectedCount: number;
  isBusy: boolean;
  onPrint: () => void;
  onGenerate: () => void;
  onOpenCreate: () => void;
}

export const StudentHeader: React.FC<Props> = ({
  selectedCount,
  isBusy,
  onPrint,
  onGenerate,
  onOpenCreate,
}) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>Students & ID Codes</h1>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
        Manage student registrations, generate 6-character exam login IDs, and print ID rosters.
      </p>
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      <Button variant="outline" onClick={onPrint} icon={<Printer size={16} />}>
        Print Slips {selectedCount > 0 ? `(${selectedCount})` : ''}
      </Button>
      <Button variant="secondary" onClick={onGenerate} disabled={selectedCount === 0 || isBusy} icon={<Key size={16} />}>
        {isBusy ? 'Generating...' : `Generate Codes (${selectedCount})`}
      </Button>
      <Button variant="primary" onClick={onOpenCreate} icon={<UserPlus size={16} weight="bold" />}>Add Student</Button>
    </div>
  </div>
);
