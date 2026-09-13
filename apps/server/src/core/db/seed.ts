import { Exam, Submission } from '@cbt/shared';

export interface DatabaseState {
  exams: Exam[];
  submissions: Submission[];
}

export const getInitialSeedData = (): DatabaseState => {
  return {
    exams: [],
    submissions: [],
  };
};

