import React, { useState } from 'react';
import { Plus, FileArchive, Assessment, Submission, Button } from '@cbt/shared';
import { AssessmentFiltersBar } from './AssessmentFiltersBar';
import { AssessmentCard } from './AssessmentCard';

interface AssessmentListViewProps {
  assessments: Assessment[];
  submissions?: Submission[];
  schoolName?: string;
  onOpenCreate: () => void;
  onOpenAssessment: (assessment: Assessment) => void;
  onEditAssessment: (assessment: Assessment) => void;
  onDuplicateAssessment: (assessment: Assessment) => void;
  onDeleteAssessment: (id: string) => void;
  onOpenLoader?: () => void;
}

export const AssessmentListView: React.FC<AssessmentListViewProps> = ({
  assessments, submissions = [], schoolName, onOpenCreate, onOpenAssessment,
  onEditAssessment, onDuplicateAssessment, onDeleteAssessment, onOpenLoader,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const availableSessions = Array.from(new Set(assessments.map((a) => a.session || '2024/2025'))).sort().reverse();

  const filtered = assessments.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSession = sessionFilter === 'all' || (e.session || '2024/2025') === sessionFilter;
    const matchType = typeFilter === 'all' || (e.assessmentType ?? 'test') === typeFilter;
    const matchLevel = levelFilter === 'all' || e.educationLevel === levelFilter;
    const matchDept = deptFilter === 'all' || e.department === deptFilter;
    return matchSearch && matchSession && matchType && matchLevel && matchDept;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>Assessments</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: 4 }}>
            Create questions and oversee your school tests and examinations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {onOpenLoader && (
            <Button variant="secondary" onClick={onOpenLoader} icon={<FileArchive size={18} />}>
              Load Package (.qzn)
            </Button>
          )}
          <Button variant="primary" onClick={onOpenCreate} icon={<Plus size={18} weight="bold" />}>
            Create Assessment
          </Button>
        </div>
      </header>

      <AssessmentFiltersBar
        searchTerm={searchTerm} onSearchChange={setSearchTerm}
        sessionFilter={sessionFilter} onSessionChange={setSessionFilter} availableSessions={availableSessions}
        typeFilter={typeFilter} onTypeChange={setTypeFilter}
        levelFilter={levelFilter} onLevelChange={setLevelFilter}
        deptFilter={deptFilter} onDeptChange={setDeptFilter}
      />

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No assessments found matching your search.</p>
          <Button variant="primary" onClick={onOpenCreate} icon={<Plus size={16} />}>Create Assessment</Button>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map((item) => (
            <AssessmentCard
              key={item.id} assessment={item} onOpen={onOpenAssessment}
              onEdit={onEditAssessment} onDuplicate={onDuplicateAssessment} onDelete={onDeleteAssessment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ExamListView = AssessmentListView;
