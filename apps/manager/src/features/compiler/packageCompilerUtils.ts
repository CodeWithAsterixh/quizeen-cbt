import { Exam, ExamScheduleConfig, compileExamZip } from '@cbt/shared';

export function createInitialSchedules(exams: Exam[]): Record<string, ExamScheduleConfig> {
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
}

export async function downloadCompiledPackage(
  exams: Exam[],
  selectedIds: string[],
  schedules: Record<string, ExamScheduleConfig>,
  packageName: string
): Promise<void> {
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
}
