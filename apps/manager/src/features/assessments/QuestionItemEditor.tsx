import React, { useState } from 'react';
import { Trash, Check, Function as FunctionIcon, Eye } from '@cbt/shared';
import { Question, Card, Button, TextInput, SelectDropdown, TextEditor, RichContent } from '@cbt/shared';
import { QuestionOptionsEditor } from './QuestionOptionsEditor';
import { QuestionImageUploader } from './QuestionImageUploader';
import { FormulaPaletteModal } from './FormulaPaletteModal';

interface Props {
  question: Question;
  index: number;
  totalQuestions: number;
  onUpdate: (updated: Partial<Question>) => void;
  onDelete: () => void;
  onDone?: () => void;
}

export const QuestionItemEditor: React.FC<Props> = ({
  question, index, totalQuestions, onUpdate, onDelete, onDone,
}) => {
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
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
            value={question.type} options={typeOptions}
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
            <TextInput type="number" min={1} label="Marks" value={question.points} onChange={(e) => onUpdate({ points: Number(e.target.value) })} />
          </div>
          {onDone && <Button type="button" variant="primary" size="sm" icon={<Check size={16} />} onClick={onDone}>Done</Button>}
          {totalQuestions > 1 && <Button type="button" variant="danger" size="sm" icon={<Trash size={16} />} onClick={onDelete} aria-label="Delete question" />}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Question Prompt & Equation Text</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsFormulaOpen(true)} icon={<FunctionIcon size={15} />}>
              Insert Formula
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsPreview(!isPreview)} icon={<Eye size={15} />}>
              {isPreview ? 'Editor' : 'Live Preview'}
            </Button>
          </div>
        </div>

        {isPreview ? (
          <div style={{ padding: 14, background: 'var(--color-bg)', borderRadius: 6, minHeight: 90 }}>
            <RichContent html={question.prompt || '*(Empty prompt)*'} />
          </div>
        ) : (
          <TextEditor placeholder="Type question text (use $math$ or Insert Formula)..." value={question.prompt} onChange={(html) => onUpdate({ prompt: html })} minHeight={90} />
        )}
      </div>

      <QuestionImageUploader imageUrl={question.imageUrl} imageCaption={question.imageCaption} onChange={onUpdate} />
      <QuestionOptionsEditor question={question} onUpdate={onUpdate} />
      <FormulaPaletteModal isOpen={isFormulaOpen} onClose={() => setIsFormulaOpen(false)} onInsert={(c) => onUpdate({ prompt: (question.prompt || '') + ' ' + c })} />
    </Card>
  );
};
