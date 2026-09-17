import React from 'react';
import { CaretRight, Submission, Assessment, Card, Button, Badge } from '@cbt/shared';
import { getGradeAndRemark } from '../analytics/grade-utils';

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
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Submissions</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '2px 0 0' }}>
            Select a student to view answers and marks.
          </p>
        </div>
        <span className="badge badge-secondary">{submissions.length} Total</span>
      </div>

      <table className="data-table" aria-label="Student results for this exam">
        <thead>
          <tr>
            <th>Student Name</th><th>Class</th><th>Score</th><th>Grade</th><th>Status</th><th>Date</th><th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>No submissions yet.</td></tr>
          ) : (
            submissions.map((sub) => {
              const isGraded = Boolean(sub.isFinalized || sub.status === 'graded');
              const isInProgress = sub.status === 'in_progress';
              const pct = sub.percentage ?? 0;
              const passed = pct >= (exam.passingScore || 50);
              const { grade, badgeColor } = getGradeAndRemark(pct, sub.classGroup || exam.targetClasses.join(' '));

              return (
                <tr key={sub.id} onClick={() => !isInProgress && onSelectSubmission(sub)} style={{ cursor: isInProgress ? 'default' : 'pointer' }}>
                  <td><strong>{sub.studentName}</strong></td>
                  <td>{sub.classGroup}</td>
                  <td>{isInProgress ? 'In Progress' : isGraded ? `${sub.score} / ${sub.totalPoints} (${pct}%)` : 'Ungraded'}</td>
                  <td>{isInProgress ? '-' : <Badge color={badgeColor} style={{ fontWeight: 800 }}>Grade {grade}</Badge>}</td>
                  <td><span className={`badge ${isInProgress ? 'badge-primary' : isGraded ? (passed ? 'badge-success' : 'badge-danger') : 'badge-warning'}`}>{isInProgress ? 'In Progress' : isGraded ? (passed ? 'Passed' : 'Failed') : 'Ungraded'}</span></td>
                  <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); if (!isInProgress) onSelectSubmission(sub); }} icon={<CaretRight size={13} />} disabled={isInProgress}>
                      {isInProgress ? 'Active' : isGraded ? 'View' : 'Grade'}
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
