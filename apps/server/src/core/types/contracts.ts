import { EducationLevel, Department, ExamScheduleConfig } from '@cbt/shared';

export interface ExamQueryFilter {
  level?: EducationLevel;
  targetClass?: string;
  department?: Department;
  assessmentType?: string;
}

export interface SubmitExamPayload {
  studentName: string;
  examId: string;
  classGroup: string;
  department?: Department;
  answers: Record<string, string>;
  infractionCount?: number;
  totalElapsedSeconds: number;
}

export interface ReviewGradesPayload {
  answers: Record<string, { awardedPoints: number; comment?: string }>;
}

export interface CompilePackagePayload {
  packageName: string;
  examIds: string[];
  schedules: ExamScheduleConfig[];
  compiledBy?: { id: string; name: string };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
