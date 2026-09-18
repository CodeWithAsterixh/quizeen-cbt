import { Submission, getLocalIsoTimestamp } from '@cbt/shared';
import { db } from '../../core/db/database.js';
import { cryptoLicenseService } from '../license/crypto-license.service.js';

export function recordLiveSession(payload: {
  examId: string;
  studentName: string;
  classGroup?: string;
  department?: any;
  infractionCount: number;
  timeSpentSeconds?: number;
}): Submission | null {
  const exam = db.getExamById(payload.examId);
  if (!exam) return null;

  const cleanName = payload.studentName.trim();
  const liveId = `live_${cleanName.replace(/\s+/g, '_')}_${exam.id}`;
  const existing = db.getSubmissionById(liveId);

  if (existing && existing.status !== 'in_progress') {
    return existing;
  }

  const lic = cryptoLicenseService.getLicenseState();
  if (lic.tier === 'free' && !existing) {
    const otherActive = db.getSubmissions().find((s) => s.status === 'in_progress' && s.studentName !== cleanName);
    if (otherActive) {
      throw new Error('Free version limit reached: Maximum 1 student station. Purchase a license to unlock multi-student testing.');
    }
  }

  const liveSub: Submission = {
    id: liveId,
    examId: exam.id,
    examTitle: exam.title,
    studentName: cleanName,
    educationLevel: exam.educationLevel,
    classGroup: payload.classGroup || '',
    department: payload.department,
    timeSpentSeconds: payload.timeSpentSeconds || (existing?.timeSpentSeconds ?? 0),
    score: 0,
    totalPoints: exam.totalPoints,
    percentage: 0,
    status: 'in_progress',
    answers: {},
    submittedAt: existing?.submittedAt || getLocalIsoTimestamp(),
    infractionCount: payload.infractionCount,
    isFinalized: false,
  };

  db.saveSubmission(liveSub);
  return liveSub;
}
