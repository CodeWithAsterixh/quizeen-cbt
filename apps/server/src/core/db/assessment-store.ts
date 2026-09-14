import fs from 'node:fs';
import path from 'node:path';
import { Exam } from '@cbt/shared';

export class AssessmentStore {
  private cache = new Map<string, Exam>();

  constructor(private dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    this.loadFromDisk();
  }

  private loadFromDisk(): void {
    try {
      const files = fs.readdirSync(this.dir).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const raw = fs.readFileSync(path.join(this.dir, file), 'utf-8');
        const exam = JSON.parse(raw) as Exam;
        if (exam.id) this.cache.set(exam.id, exam);
      }
    } catch {}
  }

  public getAll(): Exam[] {
    return Array.from(this.cache.values());
  }

  public getById(id: string): Exam | undefined {
    return this.cache.get(id);
  }

  public save(exam: Exam): void {
    this.cache.set(exam.id, exam);
    const filePath = path.join(this.dir, `${exam.id}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(exam, null, 2), 'utf-8');
    } catch {}
  }

  public delete(id: string): boolean {
    const existed = this.cache.delete(id);
    const filePath = path.join(this.dir, `${id}.json`);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {}
    return existed;
  }

  public clear(): void {
    this.cache.clear();
    try {
      const files = fs.readdirSync(this.dir).filter((f) => f.endsWith('.json'));
      for (const file of files) fs.unlinkSync(path.join(this.dir, file));
    } catch {}
  }
}
