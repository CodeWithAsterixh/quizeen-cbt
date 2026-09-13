import React, { useState } from 'react';
import { Assessment, Submission, Button } from '@cbt/shared';
import { ListNumbers, Table } from '@phosphor-icons/react';
import { AssessmentDetailHeader } from './AssessmentDetailHeader';
import { AssessmentDetailStats } from './AssessmentDetailStats';
import { AssessmentDetailResultsTable } from './AssessmentDetailResultsTable';

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
          Questions Preview ({exam.questions.length})
        </Button>
      </div>

      {activeTab === 'results' ? (
        <AssessmentDetailResultsTable
          assessment={exam}
          submissions={examSubmissions}
          onSelectSubmission={onSelectSubmission}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {exam.questions.map((q, idx) => (
            <div key={q.id} className="card" style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Q{idx + 1}</span>
                  <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>{q.type.replace('_', ' ')}</span>
                </div>
                <span className="badge badge-primary">{q.points} pt{q.points !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: q.prompt }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600 }}>
                Answer: {q.correctAnswer}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ExamDetailPage = AssessmentDetailPage;
