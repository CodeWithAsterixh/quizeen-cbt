import React, { useState } from 'react';
import { UserPlus, Users, Student, Button, Card, useAppLicense } from '@cbt/shared';
import { StudentHeader } from './StudentHeader';
import { StudentCard } from './StudentCard';
import { StudentSelectionBar } from './StudentSelectionBar';
import { SingleCodeModal } from './SingleCodeModal';
import { downloadStudentCodesPdf } from './studentCodesPdf';
import { StudentClassTabs } from './StudentClassTabs';
import { useStudentSelection } from './useStudentSelection';

interface Props {
  students: Student[];
  onOpenCreate: () => void;
  onEditStudent?: (s: Student) => void;
  onMoveStudents?: (ids: string[], direction: 'next' | 'prev') => Promise<void>;
  onGenerateCode: (id: string) => Promise<string>;
  onGenerateCodes: (studentIds: string[]) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
}

export const StudentListView: React.FC<Props> = ({
  students, onOpenCreate, onEditStudent, onMoveStudents, onGenerateCode, onGenerateCodes, onDeleteStudent,
}) => {
  const { licenseState } = useAppLicense();
  const branding = licenseState?.license?.branding;
  const primaryColor = licenseState?.license?.theme?.primaryColor || '#059669';
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [modalStudent, setModalStudent] = useState<{ student: Student; code: string } | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const filtered = selectedClass === 'all' ? students : students.filter((s) => s.classGroup === selectedClass);
  const { selectedIds, isAllSelected, handleToggleSelectAll, handleToggleSelect } = useStudentSelection(filtered.map((s) => s.id));

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
        onPrint={() => downloadStudentCodesPdf(targetForPrint, selectedClass === 'all' ? undefined : selectedClass, branding, primaryColor)}
        onGenerate={handleGenerate} onOpenCreate={onOpenCreate}
      />
      <StudentClassTabs students={students} selectedClass={selectedClass} onSelectClass={setSelectedClass} />
      <StudentSelectionBar
        isAllSelected={isAllSelected} filteredCount={filtered.length} selectedCount={selectedIds.size}
        onToggleSelectAll={handleToggleSelectAll}
        onMoveClass={(dir) => { if (onMoveStudents && selectedIds.size > 0) onMoveStudents(Array.from(selectedIds), dir); }}
      />
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
              onEdit={onEditStudent} onDelete={onDeleteStudent}
            />
          ))}
        </div>
      )}
      <SingleCodeModal isOpen={Boolean(modalStudent)} student={modalStudent?.student || null} code={modalStudent?.code || ''} onClose={() => setModalStudent(null)} />
    </div>
  );
};
