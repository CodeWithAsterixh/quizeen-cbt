import React, { useState } from 'react';
import { CheckSquare, Square, PencilSimple, Exam, ExamScheduleConfig, Card, Badge, Button } from '@cbt/shared';
import { CompilerEditModal } from './CompilerEditModal';

interface CompilerScheduleRowProps {
  exam: Exam;
  isSelected: boolean;
  schedule: ExamScheduleConfig;
  onToggle: () => void;
  onUpdate: (updated: Partial<ExamScheduleConfig>) => void;
}

export const CompilerScheduleRow: React.FC<CompilerScheduleRowProps> = ({
  exam, isSelected, schedule, onToggle, onUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deptLabel = schedule.department ? ` (${schedule.department.toUpperCase()})` : '';
  const timeSummary = `${schedule.scheduledDate} • ${schedule.startTime} to ${schedule.endTime}`;
  const pinSummary = schedule.unlockPin ? `PIN: ${schedule.unlockPin}` : 'No PIN';

  return (
    <Card accent={isSelected ? 'blue' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 10, background: isSelected ? 'var(--color-surface-hover)' : 'var(--color-surface)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <Button variant="ghost" onClick={onToggle} style={{ padding: 0, gap: 10 }}>
          {isSelected ? <CheckSquare size={22} color="var(--color-primary)" weight="fill" /> : <Square size={22} color="var(--color-border-dark)" />}
          <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-text)' }}>{exam.title}</span>
          <Badge color="blue">{exam.subject}</Badge>
        </Button>
        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          {exam.questions.length} Questions • {exam.durationMinutes} Minutes
        </div>
      </div>

      {isSelected && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span><strong>Target:</strong> {schedule.targetClass}{deptLabel}</span>
            <span>•</span>
            <span><strong>Schedule:</strong> {timeSummary}</span>
            <span>•</span>
            <span><strong>Security:</strong> {pinSummary}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            icon={<PencilSimple size={14} color="var(--color-primary)" />}
          >
            Customize
          </Button>
        </div>
      )}

      <CompilerEditModal
        isOpen={isModalOpen}
        exam={exam}
        schedule={schedule}
        onClose={() => setIsModalOpen(false)}
        onSave={onUpdate}
      />
    </Card>
  );
};
