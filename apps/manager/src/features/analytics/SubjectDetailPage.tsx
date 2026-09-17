import React from 'react';
import { ArrowLeft, Button, DownloadSimple, Assessment, Submission, Card, Badge, useAppLicense } from '@cbt/shared';
import { downloadAssessmentResultPdf } from '../grading/assessmentResultPdf';
import { getGradeAndRemark } from './grade-utils';
import { SubjectScoresTable } from './SubjectScoresTable';

interface SubjectDetailPageProps {
  className: string;
  exam: Assessment;
  submissions: Submission[];
  schoolName?: string;
  onBack: () => void;
}

export const SubjectDetailPage: React.FC<SubjectDetailPageProps> = ({
  className, exam, submissions, schoolName, onBack,
}) => {
  const { licenseState } = useAppLicense();
  const branding = licenseState?.license?.branding;
  const primaryColor = licenseState?.license?.theme?.primaryColor;
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
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
        <Button
          variant="primary"
          onClick={() => downloadAssessmentResultPdf(exam, classSubs, branding || schoolName, `${className}_${exam.subject}`, primaryColor)}
          disabled={classSubs.length === 0}
          icon={<DownloadSimple size={16} />}
        >
          Export Result (PDF)
        </Button>
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

      <SubjectScoresTable subject={exam.subject} submissions={classSubs} />
    </div>
  );
};
