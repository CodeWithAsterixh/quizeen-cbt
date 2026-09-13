import React, { useState } from 'react';
import { Exam, ExamScheduleConfig, compileExamZip, Card, TextInput } from '@cbt/shared';
import { CompilerHeader } from './CompilerHeader';
import { CompilerScheduleRow } from './CompilerScheduleRow';

interface PackageCompilerViewProps {
  exams: Exam[];
}

export const PackageCompilerView: React.FC<PackageCompilerViewProps> = ({ exams }) => {
  const [packageName, setPackageName] = useState(`Term_Assessment_${new Date().toISOString().split('T')[0]}`);
  const [selectedIds, setSelectedIds] = useState<string[]>(exams.map((e) => e.id));
  const [schedules, setSchedules] = useState<Record<string, ExamScheduleConfig>>(() => {
    const map: Record<string, ExamScheduleConfig> = {};
    const today = new Date().toISOString().split('T')[0];
    exams.forEach((e) => {
      map[e.id] = {
        examId: e.id,
        examTitle: e.title,
        targetClass: e.targetClasses[0] || 'All',
        department: e.department,
        scheduledDate: today,
        startTime: '08:30',
        endTime: '17:00',
        unlockPin: e.unlockPin || '',
      };
    });
    return map;
  });
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompileZip = async () => {
    if (!packageName.trim() || selectedIds.length === 0) return;
    setIsCompiling(true);
    try {
      const selectedExams = exams.filter((e) => selectedIds.includes(e.id));
      const activeSchedules = selectedIds.map((id) => schedules[id]);
      const { blob, filename } = await compileExamZip({
        packageName,
        compiledBy: { id: 'mgr', name: 'Chief Invigilator' },
        exams: selectedExams,
        schedules: activeSchedules,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      alert(`Could not save file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <section aria-label="Compile and Save Exams to Flash Drive" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CompilerHeader
        isCompiling={isCompiling}
        selectedCount={selectedIds.length}
        totalExams={exams.length}
        onToggleSelectAll={() => setSelectedIds(selectedIds.length === exams.length ? [] : exams.map((e) => e.id))}
        onCompile={handleCompileZip}
      />

      <Card>
        <TextInput
          label="Package File Name (.qzn)"
          helperText="This package will be saved as a .qzn file for your flash drive or student stations."
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          placeholder="e.g. First_Term_Assessments_2026"
        />
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {exams.map((exam) => (
          <CompilerScheduleRow
            key={exam.id}
            exam={exam}
            isSelected={selectedIds.includes(exam.id)}
            schedule={schedules[exam.id]}
            onToggle={() => setSelectedIds((prev) => prev.includes(exam.id) ? prev.filter((x) => x !== exam.id) : [...prev, exam.id])}
            onUpdate={(upd) => setSchedules((prev) => ({ ...prev, [exam.id]: { ...prev[exam.id], ...upd } }))}
          />
        ))}
      </div>
    </section>
  );
};
