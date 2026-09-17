import React from 'react';
import { CheckCircle, ArrowRight, Submission, Card, Button, PoweredByQueez } from '@cbt/shared';
import { CompletionReceipt } from './CompletionReceipt';

interface AssessmentCompletedScreenProps {
  submission: Submission;
  onReturnToHome: () => void;
}

export const AssessmentCompletedScreen: React.FC<AssessmentCompletedScreenProps> = ({
  submission,
  onReturnToHome,
}) => {
  return (
    <main
      aria-label="Exam Completion Receipt"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        flex: 1, padding: '2rem 1.5rem', textAlign: 'center',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <Card accent="emerald" style={{ maxWidth: 560, width: '100%', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div
          style={{
            width: 72, height: 72, borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-success-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--color-border)',
          }}
        >
          <CheckCircle size={44} color="var(--color-success)" weight="fill" />
        </div>

        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
            Your assessment has been sent for grading.
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Well done, <strong>{submission.studentName}</strong>! Your answers for{' '}
            <strong>{submission.examTitle}</strong> have been safely submitted to your teacher for marking.
          </p>
        </div>

        <CompletionReceipt submission={submission} />

        <Button
          variant="primary"
          size="lg"
          onClick={onReturnToHome}
          style={{ width: '100%' }}
        >
          Exit
        </Button>
      </Card>
      <PoweredByQueez style={{ marginTop: '1.25rem', opacity: 0.8 }} size={16} />
    </main>
  );
};

export const ExamCompletedScreen = AssessmentCompletedScreen;
