import React from 'react';
import { Submission, Card, Badge } from '@cbt/shared';

interface CompletionReceiptProps {
  submission: Submission;
}

export const CompletionReceipt: React.FC<CompletionReceiptProps> = ({ submission }) => {
  const mins = Math.floor(submission.timeSpentSeconds / 60);
  const secs = submission.timeSpentSeconds % 60;

  return (
    <Card style={{ width: '100%', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left', background: 'var(--color-surface-hover)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Student Name:</span>
        <strong style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>{submission.studentName}</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Class / Department:</span>
        <Badge color="cyan">
          {submission.classGroup} {submission.department ? `(${submission.department.toUpperCase()})` : ''}
        </Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Time Used:</span>
        <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.875rem' }}>{mins} mins {secs} secs</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Receipt ID:</span>
        <span style={{ fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '0.8rem' }}>
          {submission.id}
        </span>
      </div>
    </Card>
  );
};
