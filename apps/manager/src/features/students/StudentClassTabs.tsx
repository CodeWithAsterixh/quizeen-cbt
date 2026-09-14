import React from 'react';
import { Button, Student } from '@cbt/shared';

interface Props {
  students: Student[];
  selectedClass: string;
  onSelectClass: (cls: string) => void;
}

export const StudentClassTabs: React.FC<Props> = ({
  students,
  selectedClass,
  onSelectClass,
}) => {
  const classes = Array.from(new Set(students.map((s) => s.classGroup))).sort();

  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
      <Button
        size="sm"
        variant={selectedClass === 'all' ? 'primary' : 'secondary'}
        onClick={() => onSelectClass('all')}
      >
        All Classes ({students.length})
      </Button>
      {classes.map((cls) => (
        <Button
          key={cls}
          size="sm"
          variant={selectedClass === cls ? 'primary' : 'secondary'}
          onClick={() => onSelectClass(cls)}
        >
          {cls} ({students.filter((s) => s.classGroup === cls).length})
        </Button>
      ))}
    </div>
  );
};
