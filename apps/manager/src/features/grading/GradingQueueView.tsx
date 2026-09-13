import React, { useState } from 'react';
import { Submission, Exam, Card } from '@cbt/shared';
import { GradingTableRow } from './GradingTableRow';
import { SubmissionReviewModal } from './SubmissionReviewModal';

interface GradingQueueViewProps {
  submissions: Submission[];
  exams: Exam[];
  onUpdateSubmission: (sub: Submission) => Promise<void>;
  onSelectSubmission?: (sub: Submission) => void;
}

export const GradingQueueView: React.FC<GradingQueueViewProps> = ({
  submissions,
  exams,
  onUpdateSubmission,
  onSelectSubmission,
}) => {
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  const handleReview = (sub: Submission) => {
    if (onSelectSubmission) {
      onSelectSubmission(sub);
    } else {
      setSelectedSub(sub);
    }
  };

  return (
    <section aria-label="Student Submissions and Marking" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <header>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Mark Student Answers</h1>
        <p style={{ color: 'var(--cbt-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
          Review submitted tests, check written answers, and record marks.
        </p>
      </header>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Test Name</th>
              <th>Class</th>
              <th>Score</th>
              <th>Status</th>
              <th>Warnings</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: 'var(--cbt-text-muted)' }}>
                  No student submissions have arrived yet.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <GradingTableRow key={sub.id} sub={sub} onReview={handleReview} />
              ))
            )}
          </tbody>
        </table>
      </Card>

      {selectedSub && (
        <SubmissionReviewModal
          submission={selectedSub}
          exam={exams.find((e) => e.id === selectedSub.examId)}
          onClose={() => setSelectedSub(null)}
          onSave={onUpdateSubmission}
        />
      )}
    </section>
  );
};
