import React, { useState } from 'react';
import { Submission, Exam } from '@cbt/shared';
import { StudentResultHeader } from './StudentResultHeader';
import { GradeQuestionItem } from './GradeQuestionItem';

interface StudentResultDetailPageProps {
  submission: Submission;
  exam: Exam;
  onBack: () => void;
  onSave: (updated: Submission) => Promise<void>;
  backLabel?: string;
}

export const StudentResultDetailPage: React.FC<StudentResultDetailPageProps> = ({
  submission,
  exam,
  onBack,
  onSave,
  backLabel,
}) => {
  const [scores, setScores] = useState<Record<string, number>>(() =>
    exam.questions.reduce((acc, q) => ({ ...acc, [q.id]: submission.answers[q.id]?.awardedPoints ?? 0 }), {})
  );
  const [remarks, setRemarks] = useState<Record<string, string>>(() =>
    exam.questions.reduce((acc, q) => ({ ...acc, [q.id]: submission.answers[q.id]?.teacherRemarks ?? '' }), {})
  );

  const currentTotal = Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);
  const currentPct = exam.totalPoints > 0 ? Math.round((currentTotal / exam.totalPoints) * 100) : 0;
  const isPassed = currentPct >= (exam.passingScore || 50);

  const handleAutoGradeMatches = () => {
    const updated = { ...scores };
    exam.questions.forEach((q) => {
      const studentAns = (submission.answers[q.id]?.selectedAnswer || '').trim().toLowerCase();
      const correctAns = (q.correctAnswer || '').trim().toLowerCase();
      if (studentAns && correctAns && studentAns === correctAns) updated[q.id] = q.points;
    });
    setScores(updated);
  };

  const handleFinalize = async () => {
    const updatedAnswers = { ...submission.answers };
    exam.questions.forEach((q) => {
      updatedAnswers[q.id] = {
        questionId: q.id,
        selectedAnswer: submission.answers[q.id]?.selectedAnswer || '',
        awardedPoints: Number(scores[q.id]) || 0,
        teacherRemarks: remarks[q.id] || '',
      };
    });
    await onSave({
      ...submission, answers: updatedAnswers, score: currentTotal, percentage: currentPct,
      status: 'graded', isFinalized: true, gradedAt: new Date().toISOString(),
    });
    onBack();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <StudentResultHeader
        studentName={submission.studentName}
        classGroup={submission.classGroup}
        examTitle={submission.examTitle}
        currentTotal={currentTotal}
        totalPoints={exam.totalPoints}
        currentPct={currentPct}
        passingScore={exam.passingScore || 50}
        isPassed={isPassed}
        onAutoGrade={handleAutoGradeMatches}
        onSave={handleFinalize}
        onBack={onBack}
        backLabel={backLabel}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {exam.questions.map((q, idx) => (
          <GradeQuestionItem
            key={q.id}
            question={q}
            index={idx}
            studentAnswer={submission.answers[q.id]?.selectedAnswer || ''}
            awardedPoints={scores[q.id] ?? 0}
            remarks={remarks[q.id] ?? ''}
            onPointsChange={(pts) => setScores((prev) => ({ ...prev, [q.id]: pts }))}
            onRemarksChange={(rem) => setRemarks((prev) => ({ ...prev, [q.id]: rem }))}
          />
        ))}
      </div>
    </div>
  );
};
