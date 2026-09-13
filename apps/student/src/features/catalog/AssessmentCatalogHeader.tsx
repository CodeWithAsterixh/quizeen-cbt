import React from 'react';
import { SignOut, UserCircle } from '@phosphor-icons/react';
import { StudentSession, DEPARTMENTS, Button } from '@cbt/shared';

interface AssessmentCatalogHeaderProps {
  student: StudentSession;
  onExit: () => void;
  onChangeProfile?: () => void;
}

export const AssessmentCatalogHeader: React.FC<AssessmentCatalogHeaderProps> = ({
  student,
  onExit,
}) => {
  const departmentName = DEPARTMENTS.find((d) => d.id === student.department)?.name;

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>Your Assessments</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>
          Choose an assessment to begin.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-surface)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <UserCircle size={38} color="var(--color-primary)" weight="duotone" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>{student.studentName}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <span>{student.classGroup}</span>
              {departmentName && <span> • {departmentName}</span>}
            </div>
          </div>
        </div>

        <Button
          variant="danger"
          size="md"
          onClick={onExit}
          icon={<SignOut size={18} weight="bold" />}
          style={{ padding: '0.65rem 1.25rem', fontWeight: 700 }}
        >
          Leave Exam Room
        </Button>
      </div>
    </header>
  );
};

export const ExamCatalogHeader = AssessmentCatalogHeader;

