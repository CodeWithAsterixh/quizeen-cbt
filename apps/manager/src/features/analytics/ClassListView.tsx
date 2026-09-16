import React, { useState } from 'react';
import { MagnifyingGlass } from '@cbt/shared';
import { Card, TextInput, Button, EDUCATION_LEVELS } from '@cbt/shared';
import { ClassSummary } from './analytics-types';
import { ClassCard } from './ClassCard';

interface ClassListViewProps {
  classSummaries: ClassSummary[];
  onSelectClass: (className: string) => void;
}

export const ClassListView: React.FC<ClassListViewProps> = ({ classSummaries, onSelectClass }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const filtered = classSummaries.filter((c) => {
    const matchSearch = c.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = levelFilter === 'all' || (c.educationLevel && c.educationLevel.toLowerCase().includes(levelFilter.toLowerCase()));
    return matchSearch && matchLevel;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, margin: 0 }}>
          <TextInput
            placeholder="Search class (e.g. JSS 2, SSS 2, JAMB / UTME)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<MagnifyingGlass size={18} />}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            type="button"
            variant={levelFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setLevelFilter('all')}
          >
            All Classes ({classSummaries.length})
          </Button>
          {EDUCATION_LEVELS.map((lvl) => (
            <Button
              key={lvl.id}
              type="button"
              variant={levelFilter === lvl.name ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setLevelFilter(lvl.name)}
            >
              {lvl.name}
            </Button>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>No classes match your filter.</p>
        </Card>
      ) : (
        <div className="card-grid">
          {filtered.map((c) => (
            <ClassCard key={c.id} summary={c} onSelect={onSelectClass} />
          ))}
        </div>
      )}
    </div>
  );
};
