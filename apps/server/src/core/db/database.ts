import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Exam, Submission, Student } from '@cbt/shared';
import { DatabaseState, getInitialSeedData } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../../data');
const DB_FILE = path.join(DATA_DIR, 'cbt-store.json');

class DatabaseStore {
  private state: DatabaseState;
  constructor() { this.state = this.loadFromDisk(); }

  private loadFromDisk(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const p = JSON.parse(raw);
        return { exams: p.exams || [], submissions: p.submissions || [], students: p.students || [] };
      }
    } catch { /* fallback */ }
    const init = getInitialSeedData();
    this.saveToDisk(init);
    return init;
  }

  private saveToDisk(data: DatabaseState): void {
    try {
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch { /* In-memory fallback */ }
  }

  public getExams(): Exam[] { return [...this.state.exams]; }
  public getExamById(id: string): Exam | undefined { return this.state.exams.find((e) => e.id === id); }
  public saveExam(exam: Exam): void {
    const idx = this.state.exams.findIndex((e) => e.id === exam.id);
    if (idx >= 0) this.state.exams[idx] = exam; else this.state.exams.unshift(exam);
    this.saveToDisk(this.state);
  }
  public deleteExam(id: string): boolean {
    const prev = this.state.exams.length;
    this.state.exams = this.state.exams.filter((e) => e.id !== id);
    this.saveToDisk(this.state);
    return this.state.exams.length < prev;
  }

  public getSubmissions(): Submission[] { return [...this.state.submissions]; }
  public getSubmissionById(id: string): Submission | undefined { return this.state.submissions.find((s) => s.id === id); }
  public saveSubmission(sub: Submission): void {
    const idx = this.state.submissions.findIndex((s) => s.id === sub.id);
    if (idx >= 0) this.state.submissions[idx] = sub; else this.state.submissions.unshift(sub);
    this.saveToDisk(this.state);
  }

  public getStudents(): Student[] { return [...(this.state.students || [])]; }
  public getStudentByCode(code: string): Student | undefined {
    const c = code.trim().toUpperCase();
    return (this.state.students || []).find((s) => s.code && s.code.toUpperCase() === c);
  }
  public saveStudent(student: Student): void {
    if (!this.state.students) this.state.students = [];
    const idx = this.state.students.findIndex((s) => s.id === student.id);
    if (idx >= 0) this.state.students[idx] = student; else this.state.students.unshift(student);
    this.saveToDisk(this.state);
  }
  public deleteStudent(id: string): boolean {
    if (!this.state.students) return false;
    const prev = this.state.students.length;
    this.state.students = this.state.students.filter((s) => s.id !== id);
    this.saveToDisk(this.state);
    return this.state.students.length < prev;
  }

  public resetToSeed(): void {
    this.state = getInitialSeedData();
    this.saveToDisk(this.state);
  }
}

export const db = new DatabaseStore();
