import React from 'react';
import { Question, Button, TextEditor, RichContent } from '@cbt/shared';

interface QuestionOptionsViewProps {
  question: Question;
  currentAnswer: string;
  onSelectAnswer: (val: string) => void;
}

export const QuestionOptionsView: React.FC<QuestionOptionsViewProps> = ({
  question,
  currentAnswer,
  onSelectAnswer,
}) => {
  if (question.type === 'multiple_choice' && question.options) {
    return (
      <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <legend className="sr-only">Answer choices</legend>
        {question.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          const isSelected = currentAnswer === opt || currentAnswer === letter;
          return (
            <Button
              key={i}
              type="button"
              variant={isSelected ? 'primary' : 'secondary'}
              onClick={() => onSelectAnswer(opt)}
              aria-pressed={isSelected}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 14,
                padding: '12px 18px',
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              <span style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: isSelected ? 'var(--color-primary)' : 'var(--color-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: isSelected ? 'var(--color-surface)' : 'var(--color-text)', flexShrink: 0 }}>
                {letter}
              </span>
              <RichContent html={opt} inline />
            </Button>
          );
        })}
      </fieldset>
    );
  }

  if (question.type === 'true_false') {
    return (
      <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        <legend className="sr-only">True or False choices</legend>
        {['True', 'False'].map((opt) => (
          <Button
            key={opt}
            type="button"
            size="lg"
            variant={currentAnswer.toLowerCase() === opt.toLowerCase() ? 'primary' : 'outline'}
            onClick={() => onSelectAnswer(opt)}
          >
            {opt}
          </Button>
        ))}
      </fieldset>
    );
  }

  return (
    <div style={{ marginTop: 8 }}>
      <label className="cbt-input-label" style={{ marginBottom: 8, display: 'block' }}>
        Write your answer below (you can format with bold, headings, or lists):
      </label>
      <TextEditor
        value={currentAnswer}
        onChange={onSelectAnswer}
        placeholder="Type your formatted response here..."
        minHeight={130}
      />
    </div>
  );
};
