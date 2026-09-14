import React, { useState } from 'react';
import { Submission, Exam } from '@cbt/shared';
import { StudentResultHeader } from './StudentResultHeader';
import { GradeQuestionItem } from './GradeQuestionItem';
import { useSubmissionGrading } from './useSubmissionGrading';

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
  const {
    scores, setScores, remarks, setRemarks,
    currentTotal, currentPct, isPassed,
    handleAutoGradeMatches,
  } = useSubmissionGrading(submission, exam);

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
