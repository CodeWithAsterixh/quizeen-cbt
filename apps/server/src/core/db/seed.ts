import { Exam, Submission, Student } from '@cbt/shared';

export interface DatabaseState {
  exams: Exam[];
  submissions: Submission[];
  students: Student[];
}

export const getInitialSeedData = (): DatabaseState => {
  return {
    exams: [],
    submissions: [],
    students: [],
  };
};

