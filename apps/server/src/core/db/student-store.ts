import fs from 'node:fs';
import path from 'node:path';
import { Student } from '@cbt/shared';

export class StudentStore {
  private cache = new Map<string, Student>();

  constructor(private dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    this.loadFromDisk();
  }

  private resolveCategory(level?: string): string {
    const l = (level || '').toLowerCase();
    if (l.includes('external')) return 'external';
    if (l.includes('junior')) return 'junior';
    if (l.includes('senior')) return 'senior';
    return 'general';
  }

  private loadFromDisk(): void {
    try {
      const files = fs.readdirSync(this.dir).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const raw = fs.readFileSync(path.join(this.dir, file), 'utf-8');
        const list = JSON.parse(raw) as Student[];
        for (const s of list) if (s.id) this.cache.set(s.id, s);
      }
    } catch {}
  }

  private saveCategory(category: string): void {
    const list = Array.from(this.cache.values()).filter(
      (s) => this.resolveCategory(s.educationLevel) === category
    );
    const filePath = path.join(this.dir, `${category}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch {}
  }

  public getAll(): Student[] {
    return Array.from(this.cache.values());
  }

  public getByCode(code: string): Student | undefined {
    const c = code.trim().toUpperCase();
    return Array.from(this.cache.values()).find((s) => s.code?.toUpperCase() === c);
  }

  public save(student: Student): void {
    const prev = this.cache.get(student.id);
    this.cache.set(student.id, student);
    this.saveCategory(this.resolveCategory(student.educationLevel));
    if (prev && this.resolveCategory(prev.educationLevel) !== this.resolveCategory(student.educationLevel)) {
      this.saveCategory(this.resolveCategory(prev.educationLevel));
    }
  }

  public delete(id: string): boolean {
    const target = this.cache.get(id);
    if (!target) return false;
    this.cache.delete(id);
    this.saveCategory(this.resolveCategory(target.educationLevel));
    return true;
  }

  public clear(): void {
    this.cache.clear();
    ['external', 'junior', 'senior', 'general'].forEach((cat) => {
      const p = path.join(this.dir, `${cat}.json`);
      try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch {}
    });
  }
}
