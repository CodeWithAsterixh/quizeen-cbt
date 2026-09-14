import React, { useState, useEffect, useCallback } from 'react';
import { WarningCircle } from '@cbt/shared';
import { Assessment, Exam, StudentSession, Submission, AnswerItem, Badge } from '@cbt/shared';
import { FloatingCalculator } from '../calculator';
import { RunnerHeader } from './RunnerHeader';
import { RunnerQuestionCard } from './RunnerQuestionCard';
import { RunnerPalette } from './RunnerPalette';
import { RunnerModals } from './RunnerModals';
import { useAntiCheatTracker } from './useAntiCheatTracker';

import { buildExamSubmission } from './runnerSubmissionHelper';

interface AssessmentRunnerProps {
  assessment: Assessment;
  student: StudentSession;
  onSubmitAssessment: (submission: Submission) => Promise<void>;
  onQuit: () => void;
}

export const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({
  assessment, student, onSubmitAssessment, onQuit,
}) => {
  const exam = assessment;
  const onSubmitExam = onSubmitAssessment;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(exam.durationMinutes * 60);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isQuitOpen, setIsQuitOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { infractionCount, warningBanner } = useAntiCheatTracker();

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const submission = buildExamSubmission(exam, student, answers, secondsLeft, infractionCount);
    await onSubmitExam(submission);
  }, [answers, exam, infractionCount, isSubmitting, onSubmitExam, secondsLeft, student]);

  useEffect(() => {
    if (secondsLeft <= 0) return void handleSubmit();
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, handleSubmit]);

  const currentQ = exam.questions[currentIndex];
  const unansweredCount = exam.questions.length - Object.keys(answers).filter((k) => answers[k]?.trim()).length;

  return (
    <main aria-label="Exam workspace" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 1100, margin: '0 auto', width: '100%', padding: '20px 24px', gap: 16 }}>
      <RunnerHeader exam={exam} student={student} secondsLeft={secondsLeft} isCalcOpen={isCalcOpen} onToggleCalc={() => setIsCalcOpen((o) => !o)} onQuit={() => setIsQuitOpen(true)} />
      {warningBanner && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Badge color="amber" icon={<WarningCircle size={20} />}>{warningBanner}</Badge>
        </div>
      )}
      {currentQ && (
        <RunnerQuestionCard question={currentQ} questionNumber={currentIndex + 1} totalQuestions={exam.questions.length} currentAnswer={answers[currentQ.id] ?? ''} onSelectAnswer={(val) => setAnswers((prev) => ({ ...prev, [currentQ.id]: val }))} onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))} onNext={() => setCurrentIndex((i) => Math.min(exam.questions.length - 1, i + 1))} onSubmit={() => setIsSubmitOpen(true)} isFirst={currentIndex === 0} isLast={currentIndex === exam.questions.length - 1} />
      )}
      <RunnerPalette questions={exam.questions} currentIndex={currentIndex} answers={answers} onSelectIndex={setCurrentIndex} />
      <FloatingCalculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
      <RunnerModals isSubmitOpen={isSubmitOpen} isQuitOpen={isQuitOpen} unansweredCount={unansweredCount} isSubmitting={isSubmitting} onCloseSubmit={() => setIsSubmitOpen(false)} onConfirmSubmit={() => { setIsSubmitOpen(false); handleSubmit(); }} onCloseQuit={() => setIsQuitOpen(false)} onConfirmQuit={onQuit} />
    </main>
  );
};

export const ExamRunner = AssessmentRunner;
