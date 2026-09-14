import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Users } from '@cbt/shared';
import { Card, Button } from '@cbt/shared';
import { ClassSummary, ClassSubjectSummary, StudentClassSummary } from './analytics-types';
import { ClassSubjectsTab } from './ClassSubjectsTab';
import { ClassStudentsTab } from './ClassStudentsTab';

import { ClassDetailStats } from './ClassDetailStats';

interface ClassDetailPageProps {
  className: string;
  summary?: ClassSummary;
  subjects: ClassSubjectSummary[];
  students: StudentClassSummary[];
  onBack: () => void;
  onSelectSubject: (subjectId: string) => void;
}

export const ClassDetailPage: React.FC<ClassDetailPageProps> = ({
  className, summary, subjects, students, onBack, onSelectSubject,
}) => {
  const [activeTab, setActiveTab] = useState<'subjects' | 'students'>('subjects');

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
        <span>Back to All Classes</span>
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
            {className} Performance Report
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Overview of subjects taken and student results in {className}.
          </p>
        </div>
      </div>

      <ClassDetailStats summary={summary} studentsCount={students.length} subjectsCount={subjects.length} />

      <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
        <Button
          variant={activeTab === 'subjects' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('subjects')}
          icon={<BookOpen size={16} />}
        >
          Subjects & Assessments ({subjects.length})
        </Button>
        <Button
          variant={activeTab === 'students' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('students')}
          icon={<Users size={16} />}
        >
          All Students Summary ({students.length})
        </Button>
      </div>

      {activeTab === 'subjects' ? (
        <ClassSubjectsTab subjects={subjects} onSelectSubject={onSelectSubject} />
      ) : (
        <ClassStudentsTab students={students} className={className} />
      )}
    </div>
  );
};
