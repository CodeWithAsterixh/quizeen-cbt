import { Question, Submission } from '@cbt/shared';

export function scoreAnswers(questions: Question[], answers: Record<string, string>) {
  const answersRecord: Submission['answers'] = {};
  let totalScore = 0;
  let hasPendingReview = false;

  questions.forEach((q) => {
    const selected = (answers[q.id] || '').trim();
    let awarded = 0;

    if (q.type === 'multiple_choice' || q.type === 'true_false') {
      if (selected.toLowerCase() === q.correctAnswer.trim().toLowerCase()) awarded = q.points;
    } else {
      if (selected.toLowerCase() === q.correctAnswer.trim().toLowerCase()) awarded = q.points;
      else if (selected.length > 0) hasPendingReview = true;
    }

    answersRecord[q.id] = { questionId: q.id, selectedAnswer: selected, awardedPoints: awarded };
    totalScore += awarded;
  });

  return { answersRecord, totalScore, hasPendingReview };
}
