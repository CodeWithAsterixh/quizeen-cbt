import fs from 'node:fs';
import path from 'node:path';
import { Submission } from '@cbt/shared';

export class SubmissionStore {
  private cache = new Map<string, Submission>();

  constructor(private dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      const files = fs.readdirSync(this.dir).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const raw = fs.readFileSync(path.join(this.dir, file), 'utf-8');
        const list = JSON.parse(raw) as Submission[];
        for (const sub of list) if (sub.id) this.cache.set(sub.id, sub);
      }
    } catch {}
  }

  private saveExamSubmissions(examId: string): void {
    const list = Array.from(this.cache.values()).filter((s) => s.examId === examId);
    const safeId = examId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = path.join(this.dir, `${safeId}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch {}
  }

  public getAll(): Submission[] {
    return Array.from(this.cache.values());
  }

  public getById(id: string): Submission | undefined {
    return this.cache.get(id);
  }

  public getByExamId(examId: string): Submission[] {
    return Array.from(this.cache.values()).filter((s) => s.examId === examId);
  }

  public save(sub: Submission): void {
    this.cache.set(sub.id, sub);
    this.saveExamSubmissions(sub.examId);
  }

  public clear(): void {
    this.cache.clear();
    try {
      const files = fs.readdirSync(this.dir).filter((f) => f.endsWith('.json'));
      for (const file of files) fs.unlinkSync(path.join(this.dir, file));
    } catch {}
  }
}
