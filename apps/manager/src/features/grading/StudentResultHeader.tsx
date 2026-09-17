import React from 'react';
import { ArrowLeft, MagicWand, FloppyDisk } from '@cbt/shared';
import { Button } from '@cbt/shared';

interface StudentResultHeaderProps {
  studentName: string;
  classGroup: string;
  examTitle: string;
  currentTotal: number;
  totalPoints: number;
  currentPct: number;
  passingScore: number;
  isPassed: boolean;
  onAutoGrade: () => void;
  onSave: () => void;
  onBack: () => void;
  backLabel?: string;
}

import { GradingScoreSummaryPill } from './GradingScoreSummaryPill';

export const StudentResultHeader: React.FC<StudentResultHeaderProps> = ({
  studentName,
  classGroup,
  examTitle,
  currentTotal,
  totalPoints,
  currentPct,
  passingScore,
  isPassed,
  onAutoGrade,
  onSave,
  onBack,
  backLabel = 'Back to Results',
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button
        type="button"
        onClick={onBack}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, padding: 0, width: 'fit-content' }}
      >
        <ArrowLeft size={16} weight="bold" />
        <span>{backLabel}</span>
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
            <span className="badge badge-primary">{classGroup}</span>
            <span className="badge badge-secondary">{examTitle}</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>
            {studentName}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="outline" onClick={onAutoGrade} icon={<MagicWand size={16} />}>
            Auto Grade
          </Button>
          <Button variant="primary" onClick={onSave} icon={<FloppyDisk size={16} />}>
            Save Grade
          </Button>
        </div>
      </div>

      <GradingScoreSummaryPill
        currentTotal={currentTotal}
        totalPoints={totalPoints}
        currentPct={currentPct}
        passingScore={passingScore}
        isPassed={isPassed}
      />
    </div>
  );
};
