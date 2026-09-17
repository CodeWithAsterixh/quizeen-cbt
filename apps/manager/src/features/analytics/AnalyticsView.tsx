import React, { useState } from 'react';
import { Submission, Assessment, SelectDropdown } from '@cbt/shared';
import { AnalyticsSummaryCards } from './AnalyticsSummaryCards';
import { buildClassSummaries, buildClassSubjectSummaries, buildStudentSummaries } from './analytics-data';
import { ClassListView } from './ClassListView';
import { ClassDetailPage } from './ClassDetailPage';
import { SubjectDetailPage } from './SubjectDetailPage';

interface AnalyticsViewProps {
  submissions: Submission[];
  exams: Assessment[];
  schoolName?: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ submissions, exams, schoolName }) => {
  const [selectedClassName, setSelectedClassName] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [sessionFilter, setSessionFilter] = useState('all');

  const availableSessions = Array.from(new Set(exams.map((e) => e.session?.trim()).filter((s): s is string => Boolean(s)))).sort().reverse();
  const sessionOptions = [{ value: 'all', label: 'All Sessions' }, ...availableSessions.map((s) => ({ value: s, label: s }))];

  const filteredExams = sessionFilter === 'all' ? exams : exams.filter((e) => (e.session || '') === sessionFilter);
  const examIds = new Set(filteredExams.map((e) => e.id));
  const completed = submissions.filter((s) => s.status !== 'in_progress' && examIds.has(s.examId));

  const total = completed.length;
  const avg = total > 0 ? Math.round(completed.reduce((a, s) => a + s.percentage, 0) / total) : 0;
  const passed = completed.filter((s) => s.percentage >= 50).length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  const classSummaries = buildClassSummaries(filteredExams, completed);
  const currentClassSummary = classSummaries.find((c) => c.className === selectedClassName);
  const activeExam = filteredExams.find((e) => e.id === selectedSubjectId);

  if (selectedClassName && selectedSubjectId && activeExam) {
    return (
      <SubjectDetailPage
        className={selectedClassName} exam={activeExam} submissions={completed} schoolName={schoolName}
        onBack={() => setSelectedSubjectId(null)}
      />
    );
  }

  if (selectedClassName) {
    const subjects = buildClassSubjectSummaries(selectedClassName, filteredExams, completed);
    const students = buildStudentSummaries(selectedClassName, completed);
    const classExams = filteredExams.filter((e) => e.targetClasses.includes(selectedClassName));
    return (
      <ClassDetailPage
        className={selectedClassName} summary={currentClassSummary} subjects={subjects}
        students={students} exams={classExams} submissions={completed} schoolName={schoolName}
        sessionFilter={sessionFilter} onSessionFilterChange={setSessionFilter} sessionOptions={sessionOptions}
        onBack={() => { setSelectedClassName(null); setSelectedSubjectId(null); }}
        onSelectSubject={(id) => setSelectedSubjectId(id)}
      />
    );
  }

  return (
    <section aria-label="School Performance Overview" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Results & Scores</h1>
          <p style={{ color: 'var(--cbt-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            School-wide performance reports across all classes and subjects.
          </p>
        </div>
        <div style={{ minWidth: 200 }}>
          <SelectDropdown value={sessionFilter} onChange={setSessionFilter} options={sessionOptions} />
        </div>
      </header>

      <AnalyticsSummaryCards averageScore={avg} passRate={passRate} totalSubmissions={total} />
      <ClassListView classSummaries={classSummaries} onSelectClass={(name) => setSelectedClassName(name)} />
    </section>
  );
};
