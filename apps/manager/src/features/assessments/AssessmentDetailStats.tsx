import { Submission, Assessment } from '@cbt/shared';

interface AssessmentDetailStatsProps {
  assessment: Assessment;
  submissions: Submission[];
}

export const AssessmentDetailStats: React.FC<AssessmentDetailStatsProps> = ({
  assessment,
  submissions,
}) => {
  const exam = assessment;
  const total = submissions.length;
  const graded = submissions.filter((s) => s.isFinalized || s.status === 'graded');
  const avg = graded.length > 0
    ? Math.round(graded.reduce((a, s) => a + (s.percentage ?? 0), 0) / graded.length)
    : 0;
  const passRate = graded.length > 0
    ? Math.round((graded.filter((s) => (s.percentage ?? 0) >= (exam.passingScore || 50)).length / graded.length) * 100)
    : 0;

  const stats = [
    { label: 'Total Submissions', value: total, hint: `${exam.questions.length} questions` },
    { label: 'Average Score', value: `${avg}%`, hint: `Out of ${exam.totalPoints} pts` },
    { label: 'Pass Rate', value: `${passRate}%`, hint: `Passing mark: ${exam.passingScore || 50}%` },
    { label: 'Time Allowed', value: `${exam.durationMinutes}m`, hint: 'Total time limit' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      {stats.map((s) => (
        <div key={s.label} className="card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontWeight: 500 }}>
            {s.label}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.2rem 0', color: 'var(--color-text)' }}>
            {s.value}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {s.hint}
          </div>
        </div>
      ))}
    </div>
  );
};

export const ExamDetailStats = AssessmentDetailStats;
