import React, { useState, useMemo } from 'react';
import { Submission, Exam, Card, SubjectInput, MagnifyingGlass, SelectDropdown } from '@cbt/shared';
import { GradingTableRow } from './GradingTableRow';
import { SubmissionReviewModal } from './SubmissionReviewModal';

interface GradingQueueViewProps {
  submissions: Submission[];
  exams: Exam[];
  onUpdateSubmission: (sub: Submission) => Promise<void>;
  onSelectSubmission?: (sub: Submission) => void;
}

export const GradingQueueView: React.FC<GradingQueueViewProps> = ({
  submissions, exams, onUpdateSubmission, onSelectSubmission,
}) => {
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [filter, setFilter] = useState('');
  const [sessionFilter, setSessionFilter] = useState('all');

  const availableSessions = useMemo(() => {
    const s = new Set<string>();
    exams.forEach((e) => { if (e.session?.trim()) s.add(e.session.trim()); });
    return Array.from(s).sort().reverse();
  }, [exams]);

  const sessionOptions = useMemo(() => [
    { value: 'all', label: 'All Sessions' }, ...availableSessions.map((s) => ({ value: s, label: s })),
  ], [availableSessions]);

  const filteredSubs = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return submissions.filter((sub) => {
      const exam = exams.find((e) => e.id === sub.examId);
      if (sessionFilter !== 'all' && (exam?.session || '') !== sessionFilter) return false;
      if (!q) return true;
      return (exam?.subject || '').toLowerCase().includes(q) || sub.examTitle.toLowerCase().includes(q) || sub.studentName.toLowerCase().includes(q) || (sub.classGroup || '').toLowerCase().includes(q);
    });
  }, [submissions, exams, filter, sessionFilter]);

  const handleReview = (sub: Submission) => onSelectSubmission ? onSelectSubmission(sub) : setSelectedSub(sub);

  return (
    <section aria-label="Student Submissions and Marking" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Mark Student Answers</h1>
        <p style={{ color: 'var(--cbt-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
          Review submitted tests, check answers, and record marks.
        </p>
      </header>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 240px', maxWidth: 360 }}>
          <SubjectInput placeholder="Search student, test, or class..." value={filter} onChangeValue={setFilter} icon={<MagnifyingGlass size={18} />} />
        </div>
        {sessionOptions.length > 1 && (
          <div style={{ minWidth: 180 }}>
            <SelectDropdown value={sessionFilter} onChange={setSessionFilter} options={sessionOptions} />
          </div>
        )}
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Student Name</th><th>Test Name</th><th>Class</th><th>Score</th><th>Status</th><th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubs.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--cbt-text-muted)' }}>{submissions.length === 0 ? 'No submissions yet.' : 'No matching submissions.'}</td></tr>
            ) : (
              filteredSubs.map((sub) => <GradingTableRow key={sub.id} sub={sub} onReview={handleReview} />)
            )}
          </tbody>
        </table>
      </Card>

      {selectedSub && (
        <SubmissionReviewModal
          submission={selectedSub} exam={exams.find((e) => e.id === selectedSub.examId)}
          onClose={() => setSelectedSub(null)} onSave={onUpdateSubmission}
        />
      )}
    </section>
  );
};
