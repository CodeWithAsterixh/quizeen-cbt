import { Button, Card, Assessment, Exam, StudentSession, Submission, isAssessmentAvailable } from '@cbt/shared';
import { Tray } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { AssessmentCard } from './AssessmentCard';
import { AssessmentCatalogHeader } from './AssessmentCatalogHeader';

import { AssessmentCatalogEmpty } from './AssessmentCatalogEmpty';

interface AssessmentCatalogProps {
  student: StudentSession;
  assessments: Assessment[];
  submissions: Submission[];
  onSelectAssessment: (assessment: Assessment) => void;
  onChangeProfile?: () => void;
  onExit: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AssessmentCatalog: React.FC<AssessmentCatalogProps> = ({
  student, assessments, submissions, onSelectAssessment, onChangeProfile, onExit, onRefresh, isRefreshing,
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | 'test' | 'exam'>('all');
  const submittedExamIds = new Set(
    submissions
      .filter((s) => s.studentName.trim().toLowerCase() === student.studentName.trim().toLowerCase())
      .map((s) => s.examId)
  );

  const filteredExams = assessments.filter((exam) => {
    if (exam.isAvailable === false || exam.isPublished === false || !isAssessmentAvailable(exam)) return false;
    if (exam.educationLevel && exam.educationLevel !== student.educationLevel) return false;
    if (exam.targetClasses && exam.targetClasses.length > 0) {
      const match = exam.targetClasses.some(
        (c) => c === student.classGroup || c === 'All' || c === 'All Classes'
      );
      if (!match) return false;
    }
    if (student.educationLevel === 'senior_secondary' && student.department) {
      if (exam.department && exam.department !== student.department) return false;
    }
    if (typeFilter !== 'all' && (exam.assessmentType ?? 'test') !== typeFilter) return false;
    return true;
  });

  return (
    <main style={{ padding: '32px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
      <AssessmentCatalogHeader student={student} onExit={onExit} onRefresh={onRefresh} isRefreshing={isRefreshing} onChangeProfile={onChangeProfile} />

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['all', 'test', 'exam'] as const).map((t) => (
          <Button
            key={t}
            variant={typeFilter === t ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter(t)}
          >
            {t === 'all' ? 'All Assessments' : t === 'test' ? 'Tests' : 'Exams'}
          </Button>
        ))}
      </div>

      {filteredExams.length === 0 ? (
        <AssessmentCatalogEmpty
          student={student}
          typeFilter={typeFilter}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          onExit={onExit}
        />
      ) : (
        <section aria-label="Available assessments list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filteredExams.map((exam) => (
            <AssessmentCard key={exam.id} assessment={exam} isSubmitted={submittedExamIds.has(exam.id)} onSelectAssessment={onSelectAssessment} />
          ))}
        </section>
      )}
    </main>
  );
};

export const ExamCatalog = AssessmentCatalog;
