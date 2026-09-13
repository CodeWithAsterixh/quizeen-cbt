import React from 'react';
import { CaretRight } from '@phosphor-icons/react';
import { Submission, Assessment, Card, Button } from '@cbt/shared';

interface AssessmentDetailResultsTableProps {
  assessment: Assessment;
  submissions: Submission[];
  onSelectSubmission: (sub: Submission) => void;
}

export const AssessmentDetailResultsTable: React.FC<AssessmentDetailResultsTableProps> = ({
  assessment,
  submissions,
  onSelectSubmission,
}) => {
  const exam = assessment;
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Student Submissions</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '2px 0 0' }}>
            Click on any student record to review detailed answers and assign marks.
          </p>
        </div>
        <span className="badge badge-secondary">{submissions.length} Record{submissions.length !== 1 ? 's' : ''}</span>
      </div>

      <table className="data-table" aria-label="Student results for this exam">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Class</th>
            <th>Score</th>
            <th>Status</th>
            <th>Submitted</th>
            <th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                No student submissions recorded for this test paper yet.
              </td>
            </tr>
          ) : (
            submissions.map((sub) => {
              const isGraded = Boolean(sub.isFinalized || sub.status === 'graded');
              const pct = sub.percentage ?? 0;
              const passed = pct >= (exam.passingScore || 50);

              return (
                <tr
                  key={sub.id}
                  onClick={() => onSelectSubmission(sub)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><strong>{sub.studentName}</strong></td>
                  <td>{sub.classGroup}</td>
                  <td>{isGraded ? `${sub.score} / ${sub.totalPoints} (${pct}%)` : '—'}</td>
                  <td>
                    <span className={`badge ${isGraded ? (passed ? 'badge-success' : 'badge-danger') : 'badge-warning'}`}>
                      {isGraded ? (passed ? 'Passed' : 'Failed') : 'Awaiting Result'}
                    </span>
                  </td>
                  <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onSelectSubmission(sub); }} icon={<CaretRight size={13} />}>
                      {isGraded ? 'View Details' : 'Grade Test'}
                    </Button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </Card>
  );
};

export const ExamDetailResultsTable = AssessmentDetailResultsTable;
