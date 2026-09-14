import fs from 'node:fs';
import path from 'node:path';
import { AssessmentStore } from './assessment-store.js';
import { StudentStore } from './student-store.js';
import { SubmissionStore } from './submission-store.js';

export function runLegacyMigration(
  dataDir: string,
  assessmentStore: AssessmentStore,
  studentStore: StudentStore,
  submissionStore: SubmissionStore
): void {
  const legacyFile = path.join(dataDir, 'cbt-store.json');
  if (!fs.existsSync(legacyFile)) return;

  try {
    const raw = fs.readFileSync(legacyFile, 'utf-8');
    const legacy = JSON.parse(raw);

    if (Array.isArray(legacy.exams) && assessmentStore.getAll().length === 0) {
      for (const exam of legacy.exams) if (exam?.id) assessmentStore.save(exam);
    }
    if (Array.isArray(legacy.students) && studentStore.getAll().length === 0) {
      for (const student of legacy.students) if (student?.id) studentStore.save(student);
    }
    if (Array.isArray(legacy.submissions) && submissionStore.getAll().length === 0) {
      for (const sub of legacy.submissions) if (sub?.id) submissionStore.save(sub);
    }

    const backupFile = path.join(dataDir, 'cbt-store.json.bak');
    fs.renameSync(legacyFile, backupFile);
  } catch {}
}
