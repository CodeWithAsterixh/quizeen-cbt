import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Assessment, Exam, StudentSession, Submission, AnswerItem, Badge, apiClient } from '@cbt/shared';
import { FloatingCalculator } from '../calculator';
import { RunnerHeader } from './RunnerHeader';
import { RunnerQuestionCard } from './RunnerQuestionCard';
import { RunnerPalette } from './RunnerPalette';
import { RunnerModals } from './RunnerModals';
import { useAntiCheatTracker } from './useAntiCheatTracker';
import { buildExamSubmission } from './runnerSubmissionHelper';
import { prepareExamQuestions } from './runnerShuffleHelper';

interface AssessmentRunnerProps {
  assessment: Assessment;
  student: StudentSession;
  onSubmitAssessment: (submission: Submission) => Promise<void>;
}

export const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({
  assessment, student, onSubmitAssessment,
}) => {
  const exam = assessment;
  const onSubmitExam = onSubmitAssessment;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(exam.durationMinutes * 60);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessionSeed = `${exam.id}_${student.studentCode || student.studentId || student.studentName || 'candidate'}`;
  const questions = useMemo(
    () => prepareExamQuestions(exam.questions, exam.shuffleQuestions, exam.shuffleOptions, sessionSeed),
    [exam.questions, exam.shuffleQuestions, exam.shuffleOptions, sessionSeed]
  );

  useEffect(() => {
    apiClient.reportLiveSession({
      examId: exam.id, studentName: student.studentName,
      classGroup: student.classGroup, department: student.department, infractionCount: 0,
    });
    return () => { (window as any).electronApi?.exitExamMode?.(); };
  }, [exam.id, student.classGroup, student.department, student.studentName]);

  const answersRef = React.useRef(answers);
  answersRef.current = answers;
  const secondsLeftRef = React.useRef(secondsLeft);
  secondsLeftRef.current = secondsLeft;
  const isSubmittingRef = React.useRef(isSubmitting);
  isSubmittingRef.current = isSubmitting;

  const handleSubmit = useCallback(async () => {
    if (isSubmittingRef.current) return;
    setIsSubmitting(true);
    const submission = buildExamSubmission(exam, student, answersRef.current, secondsLeftRef.current);
    await onSubmitExam(submission);
  }, [exam, student, onSubmitExam]);

  // Auto-submit immediately if student leaves the exam window
  useAntiCheatTracker(handleSubmit);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [handleSubmit]);

  const currentQ = questions[currentIndex];
  const unansweredCount = questions.length - Object.keys(answers).filter((k) => answers[k]?.trim()).length;

  return (
    <main aria-label="Exam workspace" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 1100, margin: '0 auto', width: '100%', padding: '20px 24px', gap: 16 }}>
      <RunnerHeader exam={exam} student={student} secondsLeft={secondsLeft} isCalcOpen={isCalcOpen} onToggleCalc={() => setIsCalcOpen((o) => !o)} onQuit={() => setIsSubmitOpen(true)} />
      {currentQ && (
        <RunnerQuestionCard question={currentQ} questionNumber={currentIndex + 1} totalQuestions={questions.length} currentAnswer={answers[currentQ.id] ?? ''} onSelectAnswer={(val) => setAnswers((prev) => ({ ...prev, [currentQ.id]: val }))} onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))} onNext={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))} onSubmit={() => setIsSubmitOpen(true)} isFirst={currentIndex === 0} isLast={currentIndex === questions.length - 1} />
      )}
      <RunnerPalette questions={questions} currentIndex={currentIndex} answers={answers} onSelectIndex={setCurrentIndex} />
      <FloatingCalculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
      <RunnerModals isSubmitOpen={isSubmitOpen} unansweredCount={unansweredCount} isSubmitting={isSubmitting} onCloseSubmit={() => setIsSubmitOpen(false)} onConfirmSubmit={() => { setIsSubmitOpen(false); handleSubmit(); }} />
    </main>
  );
};

export const ExamRunner = AssessmentRunner;
