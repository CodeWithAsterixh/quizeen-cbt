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

  const isSearching = Boolean(searchTerm.trim());
  const activeClasses = classSummaries.filter((c) => c.totalSubmissions > 0 || c.subjectsCount > 0);

  const filtered = classSummaries.filter((c) => {
    const hasItems = c.totalSubmissions > 0 || c.subjectsCount > 0;
    if (!isSearching && !hasItems) return false;
    const matchSearch = !isSearching || c.className.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchLevel = levelFilter === 'all' || (c.educationLevel && c.educationLevel.toLowerCase().includes(levelFilter.toLowerCase()));
    return matchSearch && matchLevel;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, margin: 0 }}>
          <TextInput
            placeholder="Search class (e.g. SSS 2, JSS 1)..."
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
            All Classes ({activeClasses.length})
          </Button>
          {EDUCATION_LEVELS.map((lvl) => {
            const count = activeClasses.filter((c) => c.educationLevel === lvl.name).length;
            return (
              <Button
                key={lvl.id}
                type="button"
                variant={levelFilter === lvl.name ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setLevelFilter(lvl.name)}
              >
                {lvl.name} ({count})
              </Button>
            );
          })}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {isSearching ? 'No classes match your search.' : 'No classes with records for this session.'}
          </p>
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
