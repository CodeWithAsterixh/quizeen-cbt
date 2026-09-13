import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Exam, Submission } from '@cbt/shared';
import { DatabaseState, getInitialSeedData } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../data');
const DB_FILE = path.join(DATA_DIR, 'cbt-store.json');

class DatabaseStore {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadFromDisk();
  }

  private loadFromDisk(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch {
      // fallback
    }
    const init = getInitialSeedData();
    this.saveToDisk(init);
    return init;
  }

  private saveToDisk(data: DatabaseState): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // In-memory fallback
    }
  }

  public getExams(): Exam[] { return [...this.state.exams]; }
  public getExamById(id: string): Exam | undefined {
    return this.state.exams.find((e) => e.id === id);
  }

  public saveExam(exam: Exam): void {
    const idx = this.state.exams.findIndex((e) => e.id === exam.id);
    if (idx >= 0) this.state.exams[idx] = exam;
    else this.state.exams.unshift(exam);
    this.saveToDisk(this.state);
  }

  public deleteExam(id: string): boolean {
    const prevLen = this.state.exams.length;
    this.state.exams = this.state.exams.filter((e) => e.id !== id);
    this.saveToDisk(this.state);
    return this.state.exams.length < prevLen;
  }

  public getSubmissions(): Submission[] { return [...this.state.submissions]; }
  public getSubmissionById(id: string): Submission | undefined {
    return this.state.submissions.find((s) => s.id === id);
  }

  public saveSubmission(submission: Submission): void {
    const idx = this.state.submissions.findIndex((s) => s.id === submission.id);
    if (idx >= 0) this.state.submissions[idx] = submission;
    else this.state.submissions.unshift(submission);
    this.saveToDisk(this.state);
  }

  public resetToSeed(): void {
    this.state = getInitialSeedData();
    this.saveToDisk(this.state);
  }
}

export const db = new DatabaseStore();
