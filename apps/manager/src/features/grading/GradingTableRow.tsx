import React from 'react';
import { Eye, WarningCircle } from '@phosphor-icons/react';
import { Submission, Badge, Button } from '@cbt/shared';

interface GradingTableRowProps {
  sub: Submission;
  onReview: (sub: Submission) => void;
}

export const GradingTableRow: React.FC<GradingTableRowProps> = ({ sub, onReview }) => {
  return (
    <tr>
      <td>
        <div style={{ fontWeight: 700 }}>{sub.studentName}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--cbt-text-muted)' }}>
          Submitted at {new Date(sub.submittedAt).toLocaleTimeString()}
        </div>
      </td>
      <td>{sub.examTitle}</td>
      <td>
        <span>{sub.classGroup}</span>
        {sub.department && (
          <Badge color="purple" style={{ marginLeft: 6 }}>{sub.department.toUpperCase()}</Badge>
        )}
      </td>
      <td>
        <span style={{ fontWeight: 700, color: sub.percentage >= 50 ? 'var(--color-success)' : 'var(--color-danger)' }}>
          {sub.score} / {sub.totalPoints} ({sub.percentage}%)
        </span>
      </td>
      <td>
        <Badge color={sub.status === 'graded' ? 'emerald' : 'amber'}>
          {sub.status === 'graded' ? 'Marked' : 'Needs Marking'}
        </Badge>
      </td>
      <td>
        {sub.infractionCount && sub.infractionCount > 0 ? (
          <Badge color="rose">
            <WarningCircle size={14} /> {sub.infractionCount} App Switch{sub.infractionCount > 1 ? 'es' : ''}
          </Badge>
        ) : (
          <span style={{ fontSize: '0.82rem', color: 'var(--color-success)', fontWeight: 600 }}>Normal</span>
        )}
      </td>
      <td style={{ textAlign: 'right' }}>
        <Button variant="secondary" size="sm" icon={<Eye size={16} />} onClick={() => onReview(sub)}>
          Mark
        </Button>
      </td>
    </tr>
  );
};
