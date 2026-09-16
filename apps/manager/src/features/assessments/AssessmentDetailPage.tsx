import React, { useState } from 'react';
import { Assessment, Submission, Button } from '@cbt/shared';
import { ListNumbers, Table } from '@cbt/shared';
import { AssessmentDetailHeader } from './AssessmentDetailHeader';
import { AssessmentDetailStats } from './AssessmentDetailStats';
import { AssessmentDetailResultsTable } from './AssessmentDetailResultsTable';

import { AssessmentQuestionsPreview } from './AssessmentQuestionsPreview';

interface AssessmentDetailPageProps {
  assessment: Assessment;
  submissions: Submission[];
  onBack: () => void;
  onEdit: (assessment: Assessment) => void;
  onDuplicate: (assessment: Assessment) => void;
  onDelete: (id: string) => void;
  onSelectSubmission: (sub: Submission) => void;
}

export const AssessmentDetailPage: React.FC<AssessmentDetailPageProps> = ({
  assessment,
  submissions,
  onBack,
  onEdit,
  onDuplicate,
  onDelete,
  onSelectSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<'results' | 'questions'>('results');
  const exam = assessment;
  const examSubmissions = submissions.filter((s) => s.examId === exam.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AssessmentDetailHeader
        assessment={exam}
        onBack={onBack}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />

      <AssessmentDetailStats assessment={exam} submissions={examSubmissions} />

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
        <Button
          variant={activeTab === 'results' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('results')}
          icon={<Table size={16} />}
        >
          Student Results ({examSubmissions.length})
        </Button>
        <Button
          variant={activeTab === 'questions' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setActiveTab('questions')}
          icon={<ListNumbers size={16} />}
        >
          Questions ({exam.questions.length})
        </Button>
      </div>

      {activeTab === 'results' ? (
        <AssessmentDetailResultsTable
          assessment={exam}
          submissions={examSubmissions}
          onSelectSubmission={onSelectSubmission}
        />
      ) : (
        <AssessmentQuestionsPreview questions={exam.questions} />
      )}
    </div>
  );
};

export const ExamDetailPage = AssessmentDetailPage;
