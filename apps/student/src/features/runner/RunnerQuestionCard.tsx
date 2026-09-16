import React, { useState } from 'react';
import { CaretLeft, CaretRight, CheckCircle, ArrowsOutSimple } from '@cbt/shared';
import { Question, Card, Badge, Button, RichContent } from '@cbt/shared';
import { QuestionOptionsView } from './QuestionOptionsView';
import { ImageZoomModal } from './ImageZoomModal';

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
  const [isZoomOpen, setIsZoomOpen] = useState(false);

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

          <div style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.6, marginBottom: 20, color: 'var(--color-text)' }}>
            <RichContent html={question.prompt} />
          </div>

          {question.imageUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '0 0 22px 0', padding: 12, background: 'var(--color-bg)', borderRadius: 8 }}>
              <div style={{ position: 'relative', cursor: 'pointer', display: 'inline-block' }} onClick={() => setIsZoomOpen(true)}>
                <img src={question.imageUrl} alt={question.imageCaption || 'Diagram'} style={{ maxHeight: 240, maxWidth: '100%', objectFit: 'contain', borderRadius: 4 }} />
                <span style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ArrowsOutSimple size={14} /> Zoom
                </span>
              </div>
              {question.imageCaption && (
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center' }}>{question.imageCaption}</span>
              )}
            </div>
          )}

          <QuestionOptionsView question={question} currentAnswer={currentAnswer} onSelectAnswer={onSelectAnswer} />
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

      <ImageZoomModal isOpen={isZoomOpen} imageUrl={question.imageUrl} caption={question.imageCaption} onClose={() => setIsZoomOpen(false)} />
    </article>
  );
};
