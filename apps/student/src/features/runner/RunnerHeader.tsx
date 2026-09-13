import React from 'react';
import { Clock, DoorOpen } from '@phosphor-icons/react';
import { Exam, StudentSession, Card, Badge, Button } from '@cbt/shared';
import { CalcToggle } from '../calculator';

interface RunnerHeaderProps {
  exam: Exam;
  student: StudentSession;
  secondsLeft: number;
  isCalcOpen: boolean;
  onToggleCalc: () => void;
  onQuit: () => void;
}

export const RunnerHeader: React.FC<RunnerHeaderProps> = ({
  exam,
  student,
  secondsLeft,
  isCalcOpen,
  onToggleCalc,
  onQuit,
}) => {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const timerBadgeColor = secondsLeft <= 60 ? 'rose' : secondsLeft <= 300 ? 'amber' : 'cyan';

  return (
    <header>
      <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Badge color="blue">{exam.subject}</Badge>
            <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              Student: <strong style={{ color: 'var(--color-text)' }}>{student.studentName}</strong> ({student.classGroup})
            </span>
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{exam.title}</h1>
        </div>

        <nav aria-label="Exam toolbar" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Badge color={timerBadgeColor} icon={<Clock size={20} weight="fill" />} style={{ fontSize: '1.1rem', padding: '6px 14px', fontFamily: 'monospace' }}>
            {timeFormatted}
          </Badge>
          <CalcToggle isOpen={isCalcOpen} onToggle={onToggleCalc} />
          <Button variant="danger" size="sm" onClick={onQuit} icon={<DoorOpen size={18} />}>
            Leave
          </Button>
        </nav>
      </Card>
    </header>
  );
};
