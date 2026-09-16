import { Exam, StudentSession, Submission, AnswerItem, getLocalIsoTimestamp } from '@cbt/shared';

export function buildExamSubmission(
  exam: Exam,
  student: StudentSession,
  answers: Record<string, string>,
  secondsLeft: number
): Submission {
  let autoScore = 0;
  const formattedAnswers: Record<string, AnswerItem> = {};

  exam.questions.forEach((q) => {
    const selected = answers[q.id] ?? '';
    const isCorrect = (q.type === 'multiple_choice' || q.type === 'true_false') &&
      selected.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
    const points = isCorrect ? q.points : 0;
    autoScore += points;
    formattedAnswers[q.id] = { questionId: q.id, selectedAnswer: selected, awardedPoints: points };
  });

  const hasShort = exam.questions.some((q) => q.type === 'short_answer');
  const pct = exam.totalPoints > 0 ? Math.round((autoScore / exam.totalPoints) * 100) : 0;

  return {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    examId: exam.id,
    examTitle: exam.title,
    studentName: student.studentName,
    educationLevel: student.educationLevel,
    classGroup: student.classGroup,
    department: student.department,
    answers: formattedAnswers,
    timeSpentSeconds: Math.max(0, exam.durationMinutes * 60 - secondsLeft),
    score: autoScore,
    totalPoints: exam.totalPoints,
    percentage: pct,
    status: hasShort ? 'awaiting_result' : 'graded',
    submittedAt: getLocalIsoTimestamp(),
  };
}
