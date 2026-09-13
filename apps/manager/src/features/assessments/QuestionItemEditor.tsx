import React from 'react';
import { Trash, Check } from '@phosphor-icons/react';
import { Question, Card, Button, TextInput, SelectDropdown, TextEditor } from '@cbt/shared';
import { QuestionOptionsEditor } from './QuestionOptionsEditor';

interface QuestionItemEditorProps {
  question: Question;
  index: number;
  totalQuestions: number;
  onUpdate: (updated: Partial<Question>) => void;
  onDelete: () => void;
  onDone?: () => void;
}

export const QuestionItemEditor: React.FC<QuestionItemEditorProps> = ({
  question, index, totalQuestions, onUpdate, onDelete, onDone,
}) => {
  const typeOptions = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'true_false', label: 'True / False' },
    { value: 'short_answer', label: 'Short Written Answer' },
  ];

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Question #{index + 1}</span>
          <SelectDropdown
            value={question.type}
            options={typeOptions}
            onChange={(val) => {
              const t = val as Question['type'];
              onUpdate({
                type: t,
                options: t === 'multiple_choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] : t === 'true_false' ? ['True', 'False'] : undefined,
                correctAnswer: t === 'true_false' ? 'True' : 'Option A',
              });
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ maxWidth: 90 }}>
            <TextInput
              type="number"
              min={1}
              label="Marks"
              value={question.points}
              onChange={(e) => onUpdate({ points: Number(e.target.value) })}
            />
          </div>
          {onDone && (
            <Button type="button" variant="primary" size="sm" icon={<Check size={16} />} onClick={onDone}>
              Done
            </Button>
          )}
          {totalQuestions > 1 && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              icon={<Trash size={16} />}
              onClick={onDelete}
              aria-label="Delete question"
            />
          )}
        </div>
      </div>

      <div>
        <TextEditor
          label="Question Prompt & Instructions"
          placeholder="Type the question for students to answer..."
          value={question.prompt}
          onChange={(html) => onUpdate({ prompt: html })}
          minHeight={90}
        />
      </div>

      <QuestionOptionsEditor question={question} onUpdate={onUpdate} />
    </Card>
  );
};
