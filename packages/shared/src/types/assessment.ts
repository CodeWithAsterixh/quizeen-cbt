export type AssessmentType = 'test' | 'exam' | string;

export interface AssessmentTypeOption {
  id: string;
  label: string;
}

export const ASSESSMENT_TYPES: AssessmentTypeOption[] = [
  { id: 'test', label: 'Test' },
  { id: 'exam', label: 'Exam' },
];
