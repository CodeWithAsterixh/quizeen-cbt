import React from 'react';
import { Button, Card, StudentSession } from '@cbt/shared';
import { Tray } from '@phosphor-icons/react';

interface Props {
  student: StudentSession;
  typeFilter: 'all' | 'test' | 'exam';
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onExit: () => void;
}

export const AssessmentCatalogEmpty: React.FC<Props> = ({
  student, typeFilter, onRefresh, isRefreshing, onExit,
}) => (
  <Card style={{ textAlign: 'center', padding: '48px 24px', maxWidth: 580, margin: '40px auto' }}>
    <Tray size={48} color="var(--color-primary)" style={{ margin: '0 auto 16px' }} />
    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>
      No Assessments Found For Your Class
    </h2>
    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: 20 }}>
      There are no active {typeFilter === 'all' ? 'assessments' : typeFilter === 'test' ? 'tests' : 'exams'} scheduled right now for <strong>{student.classGroup}</strong>.
    </p>
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {onRefresh && (
        <Button variant="primary" onClick={onRefresh} disabled={isRefreshing}>
          {isRefreshing ? 'Refreshing...' : 'Check Again'}
        </Button>
      )}
      <Button variant="secondary" onClick={onExit}>
        Leave Exam Room
      </Button>
    </div>
  </Card>
);
