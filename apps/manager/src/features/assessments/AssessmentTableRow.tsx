import React from 'react';
import { PencilSimple, Copy, Trash, Clock } from '@phosphor-icons/react';
import { Assessment, Badge, Button, getAssessmentAvailabilityInfo } from '@cbt/shared';

interface AssessmentTableRowProps {
  assessment: Assessment;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const AssessmentTableRow: React.FC<AssessmentTableRowProps> = ({ assessment, onEdit, onDuplicate, onDelete }) => {
  const exam = assessment;
  const avail = getAssessmentAvailabilityInfo(assessment);
  return (
    <tr>
      <td>
        <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-text)' }}>{exam.subject}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
          <Badge color={avail.badgeColor}>{avail.label}</Badge>
          <Badge color="blue">{exam.session || '2024/2025'}</Badge>
          {exam.unlockPin && <Badge color="amber">PIN: {exam.unlockPin}</Badge>}
        </div>
      </td>
      <td>
        <span style={{ fontSize: '0.88rem', textTransform: 'capitalize', color: 'var(--color-text)' }}>
          {exam.educationLevel?.replace('_', ' ') ?? 'General'}
        </span>
      </td>
      <td>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)' }}>{exam.targetClasses.join(', ') || 'All Classes'}</div>
        {exam.department && <Badge color="purple" style={{ marginTop: 4 }}>{exam.department.toUpperCase()}</Badge>}
      </td>
      <td>
        <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
          <Clock size={14} style={{ display: 'inline', marginRight: 4 }} />
          {exam.durationMinutes} mins • {exam.totalPoints} total pts
        </div>
      </td>
      <td>
        <Badge color="emerald">{exam.questions.length} Questions</Badge>
      </td>
      <td style={{ textAlign: 'right' }}>
        <div style={{ display: 'inline-flex', gap: 6 }}>
          <Button variant="secondary" size="sm" onClick={onEdit} title="Edit Test Paper" icon={<PencilSimple size={16} />} />
          <Button variant="secondary" size="sm" onClick={onDuplicate} title="Make a Copy" icon={<Copy size={16} />} />
          <Button variant="danger" size="sm" onClick={onDelete} title="Delete Test Paper" icon={<Trash size={16} />} />
        </div>
      </td>
    </tr>
  );
};

export const ExamTableRow = AssessmentTableRow;
