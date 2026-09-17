import React from 'react';
import { Card, Badge, Submission } from '@cbt/shared';
import { getGradeAndRemark } from './grade-utils';

interface Props {
  subject: string;
  submissions: Submission[];
}

export const SubjectScoresTable: React.FC<Props> = ({ subject, submissions }) => (
  <Card style={{ padding: 0, overflow: 'hidden' }}>
    <table className="data-table" aria-label={`Student scores for ${subject}`}>
      <thead>
        <tr>
          <th>Student Name</th><th>Raw Score</th><th>Percentage</th>
          <th>Grade</th><th>Remark</th>
        </tr>
      </thead>
      <tbody>
        {submissions.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
              No submissions for this subject yet.
            </td>
          </tr>
        ) : (
          submissions.map((sub) => {
            const { grade, remark, badgeColor } = getGradeAndRemark(sub.percentage, sub.classGroup);
            return (
              <tr key={sub.id}>
                <td><strong style={{ color: 'var(--color-text)' }}>{sub.studentName}</strong></td>
                <td>{sub.score} / {sub.totalPoints}</td>
                <td><strong style={{ color: sub.percentage >= 50 ? 'var(--color-success)' : 'var(--color-danger)' }}>{sub.percentage}%</strong></td>
                <td><Badge color={badgeColor} style={{ fontWeight: 800 }}>Grade {grade}</Badge></td>
                <td><span style={{ fontWeight: 600 }}>{remark}</span></td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </Card>
);
