import React, { useState } from 'react';
import { MagicWand, FloppyDisk } from '@phosphor-icons/react';
import { Submission, Exam, Modal, Button } from '@cbt/shared';
import { GradeQuestionItem } from './GradeQuestionItem';

interface SubmissionReviewModalProps {
  submission: Submission;
  exam?: Exam;
  onClose: () => void;
  onSave: (updated: Submission) => Promise<void>;
}

export const SubmissionReviewModal: React.FC<SubmissionReviewModalProps> = ({
  submission, exam, onClose, onSave,
}) => {
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

  const handleFinalize = async () => {
    const updatedAnswers = { ...submission.answers };
    exam?.questions.forEach((q) => {
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
    onClose();
  };

  const footer = (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
      <Button variant="outline" onClick={handleAutoGradeMatches} icon={<MagicWand size={16} />}>Auto-Grade Matches</Button>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleFinalize} icon={<FloppyDisk size={16} />}>Save & Finalize Grade</Button>
      </div>
    </div>
  );

  return (
    <Modal title={`Marking: ${submission.studentName} | ${submission.examTitle}`} isOpen onClose={onClose} footer={footer} maxWidth={880}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface-hover)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>Total Awarded: </span>
          <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>{currentTotal} / {totalPoints} pts ({currentPct}%)</strong>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginLeft: '0.75rem' }}>Passing: {passingScore}%</span>
        </div>
        <span className={`badge ${isPassed ? 'badge-success' : 'badge-danger'}`}>
          {isPassed ? 'Passed' : 'Failed'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {exam?.questions.map((q, idx) => (
          <GradeQuestionItem
            key={q.id} question={q} index={idx}
            studentAnswer={submission.answers[q.id]?.selectedAnswer || ''}
            awardedPoints={scores[q.id] ?? 0} remarks={remarks[q.id] ?? ''}
            onPointsChange={(pts) => setScores((prev) => ({ ...prev, [q.id]: pts }))}
            onRemarksChange={(rem) => setRemarks((prev) => ({ ...prev, [q.id]: rem }))}
          />
        ))}
      </div>
    </Modal>
  );
};

