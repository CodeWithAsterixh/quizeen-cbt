import React from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { Assessment, Submission, Card, Badge } from '@cbt/shared';
import { getGradeAndRemark } from './grade-utils';

interface SubjectDetailPageProps {
  className: string;
  exam: Assessment;
  submissions: Submission[];
  onBack: () => void;
}

export const SubjectDetailPage: React.FC<SubjectDetailPageProps> = ({
  className, exam, submissions, onBack,
}) => {
  const classSubs = submissions.filter((s) => s.examId === exam.id && (s.classGroup === className || !s.classGroup));
  const total = classSubs.length;
  const avg = total > 0 ? Math.round(classSubs.reduce((a, s) => a + s.percentage, 0) / total) : 0;
  const passed = classSubs.filter((s) => s.percentage >= (exam.passingScore || 50)).length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none', color: 'var(--color-primary)',
          cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, padding: 0, width: 'fit-content',
        }}
      >
        <ArrowLeft size={16} weight="bold" />
        <span>Back to {className}</span>
      </button>

      <div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
            {exam.subject}
          </h1>
          <Badge color={exam.assessmentType === 'exam' ? 'purple' : 'blue'} style={{ textTransform: 'capitalize' }}>
            {exam.assessmentType ?? 'test'}
          </Badge>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Detailed student scores and grading breakdown for {className} ({exam.session || '2024/2025'}).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <Card style={{ padding: '0.8rem 1.1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Subject Average</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: avg >= 50 ? 'var(--color-success)' : 'var(--color-danger)' }}>{avg}%</div>
        </Card>
        <Card style={{ padding: '0.8rem 1.1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Students Tested</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)' }}>{total}</div>
        </Card>
        <Card style={{ padding: '0.8rem 1.1rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Pass Rate</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)' }}>{passRate}%</div>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table" aria-label={`Student scores for ${exam.subject}`}>
          <thead>
            <tr>
              <th>Student Name</th><th>Raw Score</th><th>Percentage</th>
              <th>Grade</th><th>Remark</th><th>Integrity</th>
            </tr>
          </thead>
          <tbody>
            {classSubs.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>No submissions for this subject yet.</td></tr>
            ) : (
              classSubs.map((sub) => {
                const { grade, remark, badgeColor } = getGradeAndRemark(sub.percentage);
                return (
                  <tr key={sub.id}>
                    <td><strong style={{ color: 'var(--color-text)' }}>{sub.studentName}</strong></td>
                    <td>{sub.score} / {sub.totalPoints}</td>
                    <td><strong style={{ color: sub.percentage >= 50 ? 'var(--color-success)' : 'var(--color-danger)' }}>{sub.percentage}%</strong></td>
                    <td><Badge color={badgeColor} style={{ fontWeight: 800 }}>Grade {grade}</Badge></td>
                    <td><span style={{ fontWeight: 600 }}>{remark}</span></td>
                    <td>{sub.infractionCount ? <Badge color="rose">{sub.infractionCount} switch(es)</Badge> : <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Clean</span>}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
