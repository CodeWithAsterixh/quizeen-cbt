import React from 'react';
import { Plus, DownloadSimple } from '@phosphor-icons/react';
import { Assessment, Submission, Button, isAssessmentAvailable } from '@cbt/shared';
import { ManagerTab } from '../../components/layout/Sidebar';
import { DashboardMetrics } from './DashboardMetrics';
import { DashboardRecentAssessments } from './DashboardRecentAssessments';
import { DashboardRecentSubs } from './DashboardRecentSubs';

interface DashboardViewProps {
  exams: Assessment[];
  submissions: Submission[];
  onNavigate: (tab: ManagerTab) => void;
  onOpenCreateExam: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  exams,
  submissions,
  onNavigate,
  onOpenCreateExam,
}) => {
  const availableCount = exams.filter((exam) => isAssessmentAvailable(exam)).length;
  const pendingGrading = submissions.filter((s) => s.status === 'awaiting_result').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)' }}>Assessment Office Overview</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: 4 }}>
            Manage assessments, export bundles to flash drives, and mark student answers.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => onNavigate('compiler')} icon={<DownloadSimple size={18} />}>
            Export Package (.qzn)
          </Button>
          <Button variant="primary" onClick={onOpenCreateExam} icon={<Plus size={18} weight="bold" />}>
            Create Assessment
          </Button>
        </div>
      </header>

      <DashboardMetrics
        examCount={exams.length}
        availableCount={availableCount}
        submissionCount={submissions.length}
        pendingGradingCount={pendingGrading}
      />

      <section aria-label="Recent activity" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20 }}>
        <DashboardRecentAssessments assessments={exams} onViewAll={() => onNavigate('exams')} />
        <DashboardRecentSubs submissions={submissions} onViewAll={() => onNavigate('grading')} />
      </section>
    </div>
  );
};
