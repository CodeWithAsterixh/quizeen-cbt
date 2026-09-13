import React from 'react';
import { Question, Card, Badge, Button } from '@cbt/shared';

interface RunnerPaletteProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  onSelectIndex: (index: number) => void;
}

export const RunnerPalette: React.FC<RunnerPaletteProps> = ({
  questions,
  currentIndex,
  answers,
  onSelectIndex,
}) => {
  const answeredCount = Object.keys(answers).filter((id) => answers[id]?.trim()).length;

  return (
    <nav aria-label="Question jump list">
      <Card style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--cbt-text-muted)' }}>
            QUESTIONS ({answeredCount} of {questions.length} answered)
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Badge color="emerald">Answered</Badge>
            <Badge color="blue">Current</Badge>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {questions.map((q, idx) => {
            const hasAnswered = Boolean(answers[q.id]?.trim());
            const isCurrent = idx === currentIndex;
            return (
              <Button
                key={q.id}
                type="button"
                variant={isCurrent ? 'primary' : hasAnswered ? 'success' : 'outline'}
                size="sm"
                onClick={() => onSelectIndex(idx)}
                aria-label={`Question ${idx + 1} ${hasAnswered ? 'answered' : 'unanswered'}`}
                style={{ width: 38, height: 38, padding: 0, fontWeight: 800 }}
              >
                {idx + 1}
              </Button>
            );
          })}
        </div>
      </Card>
    </nav>
  );
};
