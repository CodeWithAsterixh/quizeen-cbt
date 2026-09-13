import { Exam, Submission, SEED_EXAMS } from '@cbt/shared';

export interface DatabaseState {
  exams: Exam[];
  submissions: Submission[];
}

export const getInitialSeedData = (): DatabaseState => {
  return {
    exams: [...SEED_EXAMS],
    submissions: [],
  };
};
