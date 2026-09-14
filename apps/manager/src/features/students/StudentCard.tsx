import React from 'react';
import { Key, Trash } from '@cbt/shared';
import { Student, Button, Badge, Card } from '@cbt/shared';

interface Props {
  student: Student;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  onGenerateCode: (s: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentCard: React.FC<Props> = ({ student, selected, onToggleSelect, onGenerateCode, onDelete }) => {
  return (
    <Card
      style={{
        padding: '1rem', display: 'flex', flexDirection: 'column', gap: 10,
        borderColor: selected ? 'var(--color-primary)' : undefined,
        background: selected ? 'rgba(37, 99, 235, 0.04)' : undefined,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={Boolean(selected)}
              onChange={() => onToggleSelect(student.id)}
              style={{ marginTop: 3, width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              aria-label={`Select ${student.name}`}
            />
          )}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{student.name}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              {student.classGroup} {student.department ? `(${student.department})` : ''}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onDelete(student.id)} icon={<Trash size={16} color="#dc2626" />} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface-hover)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>LOGIN ID</span>
        {student.code ? (
          <code style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: 2, color: 'var(--color-primary)' }}>{student.code}</code>
        ) : (
          <Badge color="amber">No Code</Badge>
        )}
      </div>

      <Button variant="secondary" size="sm" onClick={() => onGenerateCode(student)} icon={<Key size={14} />}>
        {student.code ? 'Regenerate Code' : 'Generate Code'}
      </Button>
    </Card>
  );
};
