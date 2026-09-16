import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Exam, Submission, Student } from '@cbt/shared';
import { AssessmentStore } from './assessment-store.js';
import { StudentStore } from './student-store.js';
import { SubmissionStore } from './submission-store.js';
import { runLegacyMigration } from './database-migration.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function resolveDataDir(): string {
  if (process.env.QUEEZ_DATA_DIR && fs.existsSync(process.env.QUEEZ_DATA_DIR)) {
    return process.env.QUEEZ_DATA_DIR;
  }
  const isDev = fs.existsSync(path.resolve(process.cwd(), 'package.json')) &&
                fs.existsSync(path.resolve(process.cwd(), 'apps'));
  if (isDev) {
    const devData = path.resolve(process.cwd(), 'data');
    if (fs.existsSync(devData)) return devData;
  }
  const common = process.env.PROGRAMDATA || process.env.ALLUSERSPROFILE;
  if (common) {
    const pData = path.join(common, 'Queez CBT Suite', 'data');
    if (fs.existsSync(pData)) return pData;
  }
  const appData = process.env.APPDATA || process.env.LOCALAPPDATA;
  if (appData) {
    const pData = path.join(appData, 'Queez CBT Suite', 'data');
    if (fs.existsSync(pData)) return pData;
  }
  const candidates = [path.resolve(process.cwd(), 'data'), path.resolve(__dirname, '../data')];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return common ? path.join(common, 'Queez CBT Suite', 'data') : path.resolve(process.cwd(), 'data');
}

const DATA_DIR = resolveDataDir();

class DatabaseStore {
  private assessments = new AssessmentStore(path.join(DATA_DIR, 'assessments'));
  private students = new StudentStore(path.join(DATA_DIR, 'students'));
  private submissions = new SubmissionStore(path.join(DATA_DIR, 'submissions'));

  constructor() {
    runLegacyMigration(DATA_DIR, this.assessments, this.students, this.submissions);
  }

  getExams(): Exam[] { return this.assessments.getAll(); }
  getExamById(id: string): Exam | undefined { return this.assessments.getById(id); }
  saveExam(exam: Exam): void { this.assessments.save(exam); }
  deleteExam(id: string): boolean { return this.assessments.delete(id); }

  getSubmissions(): Submission[] { return this.submissions.getAll(); }
  getSubmissionById(id: string): Submission | undefined { return this.submissions.getById(id); }
  saveSubmission(sub: Submission): void { this.submissions.save(sub); }

  getStudents(): Student[] { return this.students.getAll(); }
  getStudentByCode(code: string): Student | undefined { return this.students.getByCode(code); }
  saveStudent(student: Student): void { this.students.save(student); }
  deleteStudent(id: string): boolean { return this.students.delete(id); }

  resetToSeed(): void {
    this.assessments.clear();
    this.students.clear();
    this.submissions.clear();
  }

  getDataDir() { return DATA_DIR; }
}

export const db = new DatabaseStore();
export { DATA_DIR };
