import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Exam, Submission, Student } from '@cbt/shared';
import { AssessmentStore } from './assessment-store.js';
import { StudentStore } from './student-store.js';
import { SubmissionStore } from './submission-store.js';
import { runLegacyMigration } from './database-migration.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../../data');

class DatabaseStore {
  private assessments = new AssessmentStore(path.join(DATA_DIR, 'assessments'));
  private students = new StudentStore(path.join(DATA_DIR, 'students'));
  private submissions = new SubmissionStore(path.join(DATA_DIR, 'submissions'));

  constructor() {
    runLegacyMigration(DATA_DIR, this.assessments, this.students, this.submissions);
  }

  public getExams(): Exam[] { return this.assessments.getAll(); }
  public getExamById(id: string): Exam | undefined { return this.assessments.getById(id); }
  public saveExam(exam: Exam): void { this.assessments.save(exam); }
  public deleteExam(id: string): boolean { return this.assessments.delete(id); }

  public getSubmissions(): Submission[] { return this.submissions.getAll(); }
  public getSubmissionById(id: string): Submission | undefined { return this.submissions.getById(id); }
  public saveSubmission(sub: Submission): void { this.submissions.save(sub); }

  public getStudents(): Student[] { return this.students.getAll(); }
  public getStudentByCode(code: string): Student | undefined { return this.students.getByCode(code); }
  public saveStudent(student: Student): void { this.students.save(student); }
  public deleteStudent(id: string): boolean { return this.students.delete(id); }

  public resetToSeed(): void {
    this.assessments.clear();
    this.students.clear();
    this.submissions.clear();
  }
}

export const db = new DatabaseStore();

