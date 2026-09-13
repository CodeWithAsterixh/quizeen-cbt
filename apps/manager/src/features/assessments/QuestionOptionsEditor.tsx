import React from 'react';
import { Check } from '@phosphor-icons/react';
import { Question, Button, TextInput } from '@cbt/shared';

interface QuestionOptionsEditorProps {
  question: Question;
  onUpdate: (updated: Partial<Question>) => void;
}

export const QuestionOptionsEditor: React.FC<QuestionOptionsEditorProps> = ({ question, onUpdate }) => {
  if (question.type === 'multiple_choice' && question.options) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span className="cbt-input-label">Answer Choices (Select the correct one)</span>
        {question.options.map((opt, optIdx) => {
          const isCorrect = question.correctAnswer === opt;
          return (
            <div key={optIdx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Button
                type="button"
                variant={isCorrect ? 'success' : 'outline'}
                size="sm"
                icon={isCorrect ? <Check size={14} weight="bold" /> : undefined}
                onClick={() => onUpdate({ correctAnswer: opt })}
              >
                {isCorrect ? 'Correct' : 'Mark Correct'}
              </Button>
              <div style={{ flex: 1 }}>
                <TextInput
                  value={opt}
                  onChange={(e) => {
                    const copy = [...(question.options || [])];
                    copy[optIdx] = e.target.value;
                    onUpdate({ options: copy, correctAnswer: isCorrect ? e.target.value : question.correctAnswer });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (question.type === 'true_false') {
    return (
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span className="cbt-input-label" style={{ margin: 0 }}>Correct Answer:</span>
        {['True', 'False'].map((tf) => (
          <Button
            key={tf}
            type="button"
            variant={question.correctAnswer === tf ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onUpdate({ correctAnswer: tf })}
          >
            {tf}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <TextInput
      label="Expected Answer Key"
      placeholder="e.g. Photosynthesis"
      value={question.correctAnswer}
      onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
    />
  );
};
