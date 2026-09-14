import { Department } from './education.js';

export interface ExamScheduleConfig {
  examId: string;
  examTitle: string;
  targetClass: string;
  department?: Department;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  unlockPin?: string;
}

export interface ExamPackageManifest {
  packageId: string;
  packageName: string;
  version: string;
  createdAt: string;
  compiledBy: { id: string; name: string };
  examCount: number;
  targetClasses: string[];
  schedules: ExamScheduleConfig[];
  checksum: string;
}
