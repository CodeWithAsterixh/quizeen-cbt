import React from 'react';
import { CaretLeft, CaretRight, CheckCircle } from '@phosphor-icons/react';
import { Question, Card, Badge, Button, RichContent } from '@cbt/shared';
import { QuestionOptionsView } from './QuestionOptionsView';

interface RunnerQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer: string;
  onSelectAnswer: (val: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const RunnerQuestionCard: React.FC<RunnerQuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  onSelectAnswer,
  onPrev,
  onNext,
  onSubmit,
  isFirst,
  isLast,
}) => {
  return (
    <article aria-label={`Question ${questionNumber} of ${totalQuestions}`}>
      <Card accent="blue" style={{ minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px' }}>
        <div>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              QUESTION {questionNumber} OF {totalQuestions}
            </span>
            <Badge color="cyan">{question.points} Points</Badge>
          </header>

          <div style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.6, marginBottom: 26, color: 'var(--color-text)' }}>
            <RichContent html={question.prompt} />
          </div>

          <QuestionOptionsView
            question={question}
            currentAnswer={currentAnswer}
            onSelectAnswer={onSelectAnswer}
          />
        </div>

        <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--color-border)' }}>
          <Button variant="secondary" onClick={onPrev} disabled={isFirst} icon={<CaretLeft size={20} />}>
            Previous
          </Button>

          {isLast ? (
            <Button variant="success" size="lg" onClick={onSubmit} icon={<CheckCircle size={22} weight="bold" />}>
              Finish & Submit Test
            </Button>
          ) : (
            <Button variant="primary" onClick={onNext}>
              <span>Next Question</span>
              <CaretRight size={20} />
            </Button>
          )}
        </footer>
      </Card>
    </article>
  );
};
