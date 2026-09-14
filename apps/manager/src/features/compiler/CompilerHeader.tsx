import React from 'react';
import { DownloadSimple, CheckSquare, Square } from '@cbt/shared';
import { Button } from '@cbt/shared';

interface CompilerHeaderProps {
  isCompiling: boolean;
  selectedCount: number;
  totalExams: number;
  onToggleSelectAll: () => void;
  onCompile: () => void;
}

export const CompilerHeader: React.FC<CompilerHeaderProps> = ({
  isCompiling,
  selectedCount,
  totalExams,
  onToggleSelectAll,
  onCompile,
}) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Export Assessments (.qzn)</h1>
        <p style={{ color: 'var(--cbt-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
          Select the assessments you want to bundle into a .qzn package for student stations.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button
          variant="secondary"
          onClick={onToggleSelectAll}
          icon={selectedCount === totalExams ? <Square size={18} /> : <CheckSquare size={18} />}
        >
          {selectedCount === totalExams ? 'Uncheck All' : 'Select All'}
        </Button>

        <Button
          variant="primary"
          onClick={onCompile}
          disabled={isCompiling || selectedCount === 0}
          icon={<DownloadSimple size={18} weight="bold" />}
        >
          {isCompiling ? 'Creating .qzn Package...' : `Save .qzn Package (${selectedCount})`}
        </Button>
      </div>
    </header>
  );
};
