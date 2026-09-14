import { Assessment, Button, getAssessmentAvailabilityInfo } from '@cbt/shared';
import { ArrowRight, CopyIcon, PencilSimpleIcon, TrashIcon } from '@cbt/shared';
import React from 'react';

interface AssessmentCardProps {
  assessment: Assessment;
  onOpen: (assessment: Assessment) => void;
  onEdit: (assessment: Assessment) => void;
  onDuplicate: (assessment: Assessment) => void;
  onDelete: (id: string) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment, onOpen, onEdit, onDuplicate, onDelete,
}) => {
  const avail = getAssessmentAvailabilityInfo(assessment);

  return (
    <div
      className="card"
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', gap: '0.85rem', padding: '1.25rem' }}
      onClick={() => onOpen(assessment)}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
            {assessment.subject}
          </h3>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span className={`badge ${assessment.assessmentType === 'exam' ? 'badge-primary' : 'badge-secondary'}`} style={{ textTransform: 'capitalize', fontSize: '0.72rem', fontWeight: 700 }}>
              {assessment.assessmentType ?? 'test'}
            </span>
            <span className={`badge ${avail.status === 'available' ? 'badge-success' : avail.status === 'upcoming' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.7rem', fontWeight: 700 }}>
              {avail.label}
            </span>
            {assessment.department && (
              <span className="badge badge-primary" style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>
                {assessment.department}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          <div>
            <span style={{ color: 'var(--color-text-subtle)', marginRight: 6 }}>Class:</span>
            <strong style={{ color: 'var(--color-text)' }}>{assessment.targetClasses?.join(', ') || assessment.educationLevel}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-subtle)', marginRight: 6 }}>Session:</span>
            <strong style={{ color: 'var(--color-text)' }}>{assessment.session || '2024/2025'}</strong>
          </div>
          {avail.detail && (
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
              {avail.detail}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <Button variant="outline" size="sm" onClick={() => onEdit(assessment)} title="Edit Assessment">
            <PencilSimpleIcon weight="duotone" size={14} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDuplicate(assessment)} title="Duplicate Assessment">
            <CopyIcon weight="duotone" size={14} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => { if (confirm(`Delete "${assessment.subject}"?`)) onDelete(assessment.id); }} title="Delete Assessment">
            <TrashIcon weight="duotone" size={14} color="var(--color-danger)" />
          </Button>
        </div>
        <Button variant="primary" size="sm" onClick={() => onOpen(assessment)} icon={<ArrowRight size={13} />}>
          Open
        </Button>
      </div>
    </div>
  );
};

export const ExamCard = AssessmentCard;
