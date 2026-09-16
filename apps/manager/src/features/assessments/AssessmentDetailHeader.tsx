import React from 'react';
import { ArrowLeft, PencilSimple, Copy, Trash, DownloadSimple, Assessment, Button } from '@cbt/shared';

interface AssessmentDetailHeaderProps {
  assessment: Assessment;
  onBack: () => void;
  onEdit: (assessment: Assessment) => void;
  onDuplicate: (assessment: Assessment) => void;
  onDelete: (id: string) => void;
  onExportResults?: () => void;
}

export const AssessmentDetailHeader: React.FC<AssessmentDetailHeaderProps> = ({
  assessment,
  onBack,
  onEdit,
  onDuplicate,
  onDelete,
  onExportResults,
}) => {
  const exam = assessment;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
        <span>Back to Assessments</span>
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
              {exam.subject}
            </h1>
            <span className={`badge ${exam.assessmentType === 'exam' ? 'badge-primary' : 'badge-secondary'}`} style={{ textTransform: 'capitalize', fontSize: '0.78rem', fontWeight: 700 }}>
              {exam.assessmentType ?? 'test'}
            </span>
          </div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: 4, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span><strong>Class:</strong> {exam.targetClasses.join(', ')}</span>
            <span>•</span>
            <span><strong>Session:</strong> {exam.session || '2024/2025'}</span>
            {exam.department && (
              <>
                <span>•</span>
                <span className="badge badge-primary" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  {exam.department}
                </span>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {onExportResults && (
            <Button variant="outline" onClick={onExportResults} icon={<DownloadSimple size={16} />}>
              Export Results (PDF)
            </Button>
          )}
          <Button variant="secondary" onClick={() => onDuplicate(exam)} icon={<Copy size={16} />}>
            Duplicate
          </Button>
          <Button variant="outline" onClick={() => { if (confirm(`Delete "${exam.subject}"?`)) onDelete(exam.id); }}>
            <Trash size={16} color="var(--color-danger)" />
          </Button>
          <Button variant="primary" onClick={() => onEdit(exam)} icon={<PencilSimple size={16} />}>
            Edit Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ExamDetailHeader = AssessmentDetailHeader;
