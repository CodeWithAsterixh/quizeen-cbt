export type AssessmentType =
  | 'first_ca'
  | 'second_ca'
  | 'third_ca'
  | 'mid_term'
  | 'class_quiz'
  | 'test'
  | 'first_term_exam'
  | 'second_term_exam'
  | 'third_term_exam'
  | 'exam'
  | 'mock_exam'
  | 'waec_practice'
  | 'neco_practice'
  | 'jamb_practice'
  | 'bece_practice'
  | 'common_entrance'
  | 'entrance_exam'
  | string;

export interface AssessmentTypeOption {
  id: string;
  label: string;
}

export const ASSESSMENT_TYPES: AssessmentTypeOption[] = [
  { id: 'first_ca', label: '1st C.A. Test' },
  { id: 'second_ca', label: '2nd C.A. Test' },
  { id: 'third_ca', label: '3rd C.A. Test' },
  { id: 'mid_term', label: 'Mid-Term Test' },
  { id: 'class_quiz', label: 'Weekly Class Quiz' },
  { id: 'test', label: 'Continuous Assessment (Test)' },
  { id: 'first_term_exam', label: '1st Term Examination' },
  { id: 'second_term_exam', label: '2nd Term Examination' },
  { id: 'third_term_exam', label: '3rd Term / Promotional Exam' },
  { id: 'exam', label: 'Terminal Examination (Exam)' },
  { id: 'mock_exam', label: 'Mock Exam (SSCE / BECE)' },
  { id: 'waec_practice', label: 'WAEC / WASSCE Practice' },
  { id: 'neco_practice', label: 'NECO / SSCE Practice' },
  { id: 'jamb_practice', label: 'JAMB / UTME Practice' },
  { id: 'bece_practice', label: 'BECE / Junior WAEC Practice' },
  { id: 'common_entrance', label: 'Common Entrance Examination' },
  { id: 'entrance_exam', label: 'Entrance & Scholarship Exam' },
];
