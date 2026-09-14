import { useState } from 'react';
import { Submission, Exam } from '@cbt/shared';

export function useSubmissionGrading(submission: Submission, exam?: Exam) {
  const [scores, setScores] = useState<Record<string, number>>(() =>
    exam?.questions.reduce((acc, q) => ({ ...acc, [q.id]: submission.answers[q.id]?.awardedPoints ?? 0 }), {}) ?? {}
  );
  const [remarks, setRemarks] = useState<Record<string, string>>(() =>
    exam?.questions.reduce((acc, q) => ({ ...acc, [q.id]: submission.answers[q.id]?.teacherRemarks ?? '' }), {}) ?? {}
  );

  const totalPoints = exam?.totalPoints || submission.totalPoints || 1;
  const passingScore = exam?.passingScore || 50;
  const currentTotal = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const currentPct = Math.round((currentTotal / totalPoints) * 100);
  const isPassed = currentPct >= passingScore;

  const handleAutoGradeMatches = () => {
    if (!exam) return;
    const updated = { ...scores };
    exam.questions.forEach((q) => {
      const studentAns = (submission.answers[q.id]?.selectedAnswer || '').trim().toLowerCase();
      const correctAns = (q.correctAnswer || '').trim().toLowerCase();
      if (studentAns && correctAns && studentAns === correctAns) updated[q.id] = q.points;
    });
    setScores(updated);
  };

  return {
    scores, setScores, remarks, setRemarks,
    totalPoints, passingScore, currentTotal, currentPct, isPassed,
    handleAutoGradeMatches,
  };
}
