import { Submission } from '@cbt/shared';
import { db } from '../../core/db/database.js';
import { SubmitExamPayload, ReviewGradesPayload } from '../../core/types/contracts.js';

import { scoreAnswers } from './scoring-helper.js';

export class GradingService {
  public submitAndGrade(payload: SubmitExamPayload): Submission {
    const exam = db.getExamById(payload.examId);
    if (!exam) throw new Error(`Exam not found: ${payload.examId}`);

    const { answersRecord, totalScore, hasPendingReview } = scoreAnswers(exam.questions, payload.answers);

    const totalPoints = exam.totalPoints || 1;
    const percentage = Math.round((totalScore / totalPoints) * 100);

    const submission: Submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      examId: exam.id,
      examTitle: exam.title,
      studentName: payload.studentName.trim(),
      educationLevel: exam.educationLevel,
      classGroup: payload.classGroup,
      department: payload.department,
      timeSpentSeconds: payload.totalElapsedSeconds || 0,
      score: totalScore,
      totalPoints,
      percentage,
      status: hasPendingReview ? 'awaiting_result' : 'graded',
      answers: answersRecord,
      submittedAt: new Date().toISOString(),
      infractionCount: payload.infractionCount || 0,
      isFinalized: !hasPendingReview,
    };

    db.saveSubmission(submission);
    return submission;
  }

  public reviewSubmission(id: string, payload: ReviewGradesPayload): Submission | null {
    const sub = db.getSubmissionById(id);
    if (!sub) return null;

    const answers = { ...sub.answers };
    let newScore = 0;

    Object.entries(payload.answers).forEach(([qId, review]) => {
      if (answers[qId]) {
        answers[qId] = { ...answers[qId], awardedPoints: review.awardedPoints };
      }
    });

    Object.values(answers).forEach((a: any) => { newScore += a.awardedPoints ?? 0; });
    const pct = sub.totalPoints > 0 ? Math.round((newScore / sub.totalPoints) * 100) : 0;

    const updated: Submission = {
      ...sub,
      answers,
      score: newScore,
      percentage: pct,
      status: 'graded',
      isFinalized: true,
      gradedAt: new Date().toISOString(),
    };

    db.saveSubmission(updated);
    return updated;
  }

  public listSubmissions(examId?: string): Submission[] {
    const all = db.getSubmissions();
    return examId ? all.filter((s) => s.examId === examId) : all;
  }
}

export const gradingService = new GradingService();
