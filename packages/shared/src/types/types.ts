import { EducationLevel, Department } from './education.js';
import { AssessmentType } from './assessment.js';

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface Question {
  id: string;
  prompt: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
}

export interface Exam {
  id: string;
  title: string;
  description?: string; session?: string;
  subject: string; assessmentType?: AssessmentType;
  educationLevel: EducationLevel;
  targetClasses: string[];
  department?: Department;
  durationMinutes: number;
  passingScore: number;
  totalPoints: number;
  questions: Question[];
  objectiveGrading?: 'automatic' | 'manual';
  instructions?: string;
  shuffleQuestions?: boolean; shuffleOptions?: boolean;
  scheduledDate?: string; startTime?: string; endTime?: string;
  isAvailable?: boolean; availableFrom?: string; availableTo?: string;
  unlockPin?: string; createdBy?: string; teacherName?: string;
  createdAt: string; isPublished: boolean;
}

export type Assessment = Exam;

export interface AnswerItem {
  questionId: string;
  selectedAnswer: string;
  awardedPoints?: number;
  teacherRemarks?: string;
}

export type SubmissionStatus = 'awaiting_result' | 'graded';

export interface Submission {
  id: string;
  examId: string;
  examTitle: string;
  studentName: string;
  educationLevel: EducationLevel;
  classGroup: string;
  department?: Department;
  answers: Record<string, AnswerItem>;
  timeSpentSeconds: number;
  score: number;
  totalPoints: number;
  percentage: number;
  status: SubmissionStatus;
  submittedAt: string;
  gradedAt?: string;
  isFinalized?: boolean;
  infractionCount?: number;
}

export interface StudentSession {
  studentName: string;
  educationLevel: EducationLevel;
  classGroup: string;
  department?: Department;
  loggedInAt: string;
}

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
