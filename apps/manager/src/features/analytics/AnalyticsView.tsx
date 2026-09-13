import React, { useState } from 'react';
import { Submission, Assessment } from '@cbt/shared';
import { AnalyticsSummaryCards } from './AnalyticsSummaryCards';
import { buildClassSummaries, buildClassSubjectSummaries, buildStudentSummaries } from './analytics-data';
import { ClassListView } from './ClassListView';
import { ClassDetailPage } from './ClassDetailPage';
import { SubjectDetailPage } from './SubjectDetailPage';

interface AnalyticsViewProps {
  submissions: Submission[];
  exams: Assessment[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ submissions, exams }) => {
  const [selectedClassName, setSelectedClassName] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const total = submissions.length;
  const avg = total > 0 ? Math.round(submissions.reduce((a, s) => a + s.percentage, 0) / total) : 0;
  const passed = submissions.filter((s) => s.percentage >= 50).length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
  const infractions = submissions.reduce((a, s) => a + (s.infractionCount || 0), 0);

  const classSummaries = buildClassSummaries(exams, submissions);
  const currentClassSummary = classSummaries.find((c) => c.className === selectedClassName);
  const activeExam = exams.find((e) => e.id === selectedSubjectId);

  if (selectedClassName && selectedSubjectId && activeExam) {
    return (
      <SubjectDetailPage
        className={selectedClassName}
        exam={activeExam}
        submissions={submissions}
        onBack={() => setSelectedSubjectId(null)}
      />
    );
  }

  if (selectedClassName) {
    const subjects = buildClassSubjectSummaries(selectedClassName, exams, submissions);
    const students = buildStudentSummaries(selectedClassName, submissions);
    return (
      <ClassDetailPage
        className={selectedClassName}
        summary={currentClassSummary}
        subjects={subjects}
        students={students}
        onBack={() => { setSelectedClassName(null); setSelectedSubjectId(null); }}
        onSelectSubject={(id) => setSelectedSubjectId(id)}
      />
    );
  }

  return (
    <section aria-label="School Performance Overview" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Results & Scores</h1>
        <p style={{ color: 'var(--cbt-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
          School-wide performance reports across all classes and subjects.
        </p>
      </header>

      <AnalyticsSummaryCards
        averageScore={avg}
        passRate={passRate}
        totalSubmissions={total}
        totalInfractions={infractions}
      />

      <ClassListView
        classSummaries={classSummaries}
        onSelectClass={(name) => setSelectedClassName(name)}
      />
    </section>
  );
};
