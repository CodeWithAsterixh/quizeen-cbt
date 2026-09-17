import React from 'react';
import { Card, Badge } from '@cbt/shared';
import { StudentClassSummary } from './analytics-types';

interface ClassStudentsTabProps {
  students: StudentClassSummary[];
  className: string;
}

export const ClassStudentsTab: React.FC<ClassStudentsTabProps> = ({ students, className }) => {
  if (students.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>No submissions for {className} yet.</p>
      </Card>
    );
  }

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Student Summary</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '2px 0 0' }}>
            Student averages, grades, and remarks.
          </p>
        </div>
        <Badge color="blue">{students.length} Student{students.length !== 1 ? 's' : ''}</Badge>
      </div>

      <table className="data-table" aria-label={`Students in ${className}`}>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Tests</th>
            <th>Average</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Remark</th>
            <th>Switches</th>
          </tr>
        </thead>
        <tbody>
          {students.map((st, idx) => (
            <tr key={st.studentName}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-muted)', width: 20 }}>#{idx + 1}</span>
                  <strong style={{ color: 'var(--color-text)' }}>{st.studentName}</strong>
                </div>
              </td>
              <td>{st.submissionsCount} test{st.submissionsCount !== 1 ? 's' : ''}</td>
              <td>
                <strong style={{ color: st.averagePercentage >= 50 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {st.averagePercentage}%
                </strong>
              </td>
              <td>
                <Badge color={st.badgeColor} style={{ fontWeight: 800 }}>Grade {st.grade}</Badge>
              </td>
              <td>
                <span className={`badge ${st.passedCount >= st.failedCount ? 'badge-success' : 'badge-danger'}`}>
                  {st.passedCount >= st.failedCount ? 'Passed' : 'At Risk'}
                </span>
              </td>
              <td>
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{st.remark}</span>
              </td>
              <td>
                {st.infractions > 0 ? (
                  <Badge color="rose">{st.infractions}</Badge>
                ) : (
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>0</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
