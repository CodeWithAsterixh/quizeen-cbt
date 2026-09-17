export interface ClassSummary {
  id: string;
  className: string;
  educationLevel?: string;
  department?: string;
  studentsCount: number;
  subjectsCount: number;
  totalSubmissions: number;
  averageScore: number;
  passRate: number;
}

export interface ClassSubjectSummary {
  subjectId: string;
  subjectName: string;
  assessmentType: string;
  totalPoints: number;
  passingScore: number;
  submissionsCount: number;
  averageScore: number;
  passRate: number;
  highestScore: number;
  lowestScore: number;
}

import { GradeType } from './grade-utils';

export interface StudentClassSummary {
  studentName: string;
  classGroup: string;
  department?: string;
  submissionsCount: number;
  averagePercentage: number;
  grade: GradeType;
  remark: string;
  badgeColor: 'emerald' | 'blue' | 'amber' | 'rose';
  infractions: number;
  passedCount: number;
  failedCount: number;
}

