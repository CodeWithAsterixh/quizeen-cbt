import React, { useState } from 'react';
import { UserPlus, Printer, Key, Users } from '@phosphor-icons/react';
import { Student, Button, Card } from '@cbt/shared';
import { StudentCard } from './StudentCard';
import { SingleCodeModal } from './SingleCodeModal';
import { printStudentCodesPdf } from './StudentPrintReport';

interface Props {
  students: Student[];
  onOpenCreate: () => void;
  onGenerateCode: (id: string) => Promise<string>;
  onGenerateAllCodes: (classGroup?: string) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
}

export const StudentListView: React.FC<Props> = ({
  students, onOpenCreate, onGenerateCode, onGenerateAllCodes, onDeleteStudent,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [modalStudent, setModalStudent] = useState<{ student: Student; code: string } | null>(null);

  const classes = Array.from(new Set(students.map((s) => s.classGroup))).sort();
  const filtered = selectedClass === 'all' ? students : students.filter((s) => s.classGroup === selectedClass);

  const handleGenerateSingle = async (s: Student) => {
    const code = await onGenerateCode(s.id);
    setModalStudent({ student: s, code });
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>Students & ID Codes</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
            Manage student registrations, generate 6-character exam login IDs, and print ID rosters.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" onClick={() => printStudentCodesPdf(filtered, selectedClass === 'all' ? undefined : selectedClass)} icon={<Printer size={16} />}>
            Print / PDF Slips
          </Button>
          <Button variant="secondary" onClick={() => onGenerateAllCodes(selectedClass === 'all' ? undefined : selectedClass)} icon={<Key size={16} />}>
            Generate Codes for {selectedClass === 'all' ? 'All' : selectedClass}
          </Button>
          <Button variant="primary" onClick={onOpenCreate} icon={<UserPlus size={16} weight="bold" />}>
            Add Student
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        <Button size="sm" variant={selectedClass === 'all' ? 'primary' : 'secondary'} onClick={() => setSelectedClass('all')}>
          All Classes ({students.length})
        </Button>
        {classes.map((cls) => (
          <Button key={cls} size="sm" variant={selectedClass === cls ? 'primary' : 'secondary'} onClick={() => setSelectedClass(cls)}>
            {cls} ({students.filter((s) => s.classGroup === cls).length})
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Users size={48} color="var(--color-text-muted)" weight="duotone" />
          <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>No students in this view</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>Add students to assign classes and generate 6-character login IDs.</p>
          <Button variant="secondary" onClick={onOpenCreate} icon={<UserPlus size={16} />}>Create Student</Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {filtered.map((s) => (
            <StudentCard key={s.id} student={s} onGenerateCode={handleGenerateSingle} onDelete={onDeleteStudent} />
          ))}
        </div>
      )}

      <SingleCodeModal
        isOpen={Boolean(modalStudent)}
        student={modalStudent?.student || null}
        code={modalStudent?.code || ''}
        onClose={() => setModalStudent(null)}
      />
    </div>
  );
};
