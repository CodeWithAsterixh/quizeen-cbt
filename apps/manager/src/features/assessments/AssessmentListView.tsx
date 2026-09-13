import React, { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { Assessment, Button } from '@cbt/shared';
import { AssessmentFiltersBar } from './AssessmentFiltersBar';
import { AssessmentCard } from './AssessmentCard';

interface AssessmentListViewProps {
  assessments: Assessment[];
  onOpenCreate: () => void;
  onOpenAssessment: (assessment: Assessment) => void;
  onEditAssessment: (assessment: Assessment) => void;
  onDuplicateAssessment: (assessment: Assessment) => void;
  onDeleteAssessment: (id: string) => void;
}

export const AssessmentListView: React.FC<AssessmentListViewProps> = ({
  assessments, onOpenCreate, onOpenAssessment, onEditAssessment, onDuplicateAssessment, onDeleteAssessment,
}) => {
  const exams = assessments;
  const onOpenExam = onOpenAssessment;
  const onEditExam = onEditAssessment;
  const onDuplicateExam = onDuplicateAssessment;
  const onDeleteExam = onDeleteAssessment;
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const filtered = exams.filter((e) => {
    const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || (e.assessmentType ?? 'test') === typeFilter;
    const matchLevel = levelFilter === 'all' || e.educationLevel === levelFilter;
    const matchDept = deptFilter === 'all' || e.department === deptFilter;
    return matchSearch && matchType && matchLevel && matchDept;
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
        <Button variant="primary" onClick={onOpenCreate} icon={<Plus size={18} weight="bold" />}>
          Create Assessment
        </Button>
      </header>

      <AssessmentFiltersBar
        searchTerm={searchTerm} onSearchChange={setSearchTerm}
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
              key={item.id}
              assessment={item}
              onOpen={onOpenExam}
              onEdit={onEditExam}
              onDuplicate={onDuplicateExam}
              onDelete={onDeleteExam}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ExamListView = AssessmentListView;
