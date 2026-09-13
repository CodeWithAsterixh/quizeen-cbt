import React, { useState } from 'react';
import { UserPlus, Users } from '@phosphor-icons/react';
import { Student, Button, Card } from '@cbt/shared';
import { StudentHeader } from './StudentHeader';
import { StudentCard } from './StudentCard';
import { StudentSelectionBar } from './StudentSelectionBar';
import { SingleCodeModal } from './SingleCodeModal';
import { printStudentCodesPdf } from './StudentPrintReport';

interface Props {
  students: Student[];
  onOpenCreate: () => void;
  onGenerateCode: (id: string) => Promise<string>;
  onGenerateCodes: (studentIds: string[]) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
}

export const StudentListView: React.FC<Props> = ({
  students, onOpenCreate, onGenerateCode, onGenerateCodes, onDeleteStudent,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalStudent, setModalStudent] = useState<{ student: Student; code: string } | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const classes = Array.from(new Set(students.map((s) => s.classGroup))).sort();
  const filtered = selectedClass === 'all' ? students : students.filter((s) => s.classGroup === selectedClass);
  const filteredIds = filtered.map((s) => s.id);
  const selectedInFilter = filteredIds.filter((id) => selectedIds.has(id));
  const isAllSelected = filtered.length > 0 && selectedInFilter.length === filtered.length;

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredIds.forEach((id) => (isAllSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleGenerate = async () => {
    if (selectedIds.size === 0) return;
    setIsBusy(true);
    try { await onGenerateCodes(Array.from(selectedIds)); } finally { setIsBusy(false); }
  };

  const targetForPrint = selectedIds.size > 0 ? filtered.filter((s) => selectedIds.has(s.id)) : filtered;

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <StudentHeader
        selectedCount={selectedIds.size} isBusy={isBusy}
        onPrint={() => printStudentCodesPdf(targetForPrint, selectedClass === 'all' ? undefined : selectedClass)}
        onGenerate={handleGenerate} onOpenCreate={onOpenCreate}
      />

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

      <StudentSelectionBar isAllSelected={isAllSelected} filteredCount={filtered.length} selectedCount={selectedIds.size} onToggleSelectAll={handleToggleSelectAll} />

      {filtered.length === 0 ? (
        <Card style={{ padding: '2.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Users size={42} color="var(--color-text-muted)" weight="duotone" />
          <div style={{ fontWeight: 600 }}>No students in this view</div>
          <Button variant="secondary" size="sm" onClick={onOpenCreate} icon={<UserPlus size={16} />}>Create Student</Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {filtered.map((s) => (
            <StudentCard
              key={s.id} student={s} selected={selectedIds.has(s.id)} onToggleSelect={handleToggleSelect}
              onGenerateCode={async (st) => { const code = await onGenerateCode(st.id); setModalStudent({ student: st, code }); }}
              onDelete={onDeleteStudent}
            />
          ))}
        </div>
      )}

      <SingleCodeModal isOpen={Boolean(modalStudent)} student={modalStudent?.student || null} code={modalStudent?.code || ''} onClose={() => setModalStudent(null)} />
    </div>
  );
};
