import JSZip from 'jszip';
import { Exam, ExamPackageManifest, ExamScheduleConfig } from '../types/index.js';
import { computeChecksum } from './zip-checksum.js';

export interface CompileZipOptions {
  packageName: string;
  compiledBy: { id: string; name: string };
  exams: Exam[];
  schedules: ExamScheduleConfig[];
}

export async function compileExamZip(options: CompileZipOptions): Promise<{
  blob: Blob;
  manifest: ExamPackageManifest;
  filename: string;
}> {
  const { packageName, compiledBy, exams, schedules } = options;

  const preparedExams: Exam[] = exams.map((exam) => {
    const sched = schedules.find((s) => s.examId === exam.id);
    if (!sched) return exam;
    return {
      ...exam,
      targetClasses: sched.targetClass ? [sched.targetClass] : (exam.targetClasses ?? []),
      department: sched.department ?? exam.department,
      scheduledDate: sched.scheduledDate || undefined,
      startTime: sched.startTime || undefined,
      endTime: sched.endTime || undefined,
      unlockPin: sched.unlockPin || undefined,
    };
  });

  const examsJson = JSON.stringify(preparedExams, null, 2);
  const checksum = await computeChecksum(examsJson);
  const allClasses = Array.from(new Set(schedules.map((s) => s.targetClass).filter(Boolean)));

  const manifest: ExamPackageManifest = {
    packageId: `pkg_${Date.now()}`,
    packageName: packageName.trim(),
    version: '2.0',
    createdAt: new Date().toISOString(),
    compiledBy,
    examCount: preparedExams.length,
    targetClasses: allClasses,
    schedules,
    checksum,
  };

  const zip = new JSZip();
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  zip.file('exams.json', examsJson);

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const safeName = packageName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return { blob, manifest, filename: `${safeName || 'assessment_package'}.qzn` };
}

export const compileAssessmentPackage = compileExamZip;
