import React, { useState } from 'react';
import { Question, Card, Button, SelectDropdown, TextEditor, RichContent, Trash, Check, Function as FunctionIcon, Eye } from '@cbt/shared';
import { QuestionOptionsEditor } from './QuestionOptionsEditor';
import { QuestionImageUploader } from './QuestionImageUploader';
import { FormulaPaletteModal } from './FormulaPaletteModal';
import { FormulaInteractiveEditorModal } from './FormulaInteractiveEditorModal';

interface Props {
  question: Question; index: number; totalQuestions: number;
  onUpdate: (updated: Partial<Question>) => void; onDelete: () => void; onDone?: () => void;
}

export const QuestionItemEditor: React.FC<Props> = ({
  question, index, totalQuestions, onUpdate, onDelete, onDone,
}) => {
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [editingFormula, setEditingFormula] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const typeOptions = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'true_false', label: 'True / False' },
    { value: 'short_answer', label: 'Short Written Answer' },
  ];

  const handleInsertSnippet = (c: string) => {
    const current = question.prompt || '';
    const isTable = c.trim().startsWith('|');
    const needsBreak = current.length > 0 && !current.endsWith('\n');
    const sep = isTable ? (needsBreak ? '\n\n' : '\n') : ' ';
    onUpdate({ prompt: current ? `${current}${sep}${c}` : c });
  };

  const updateFormula = (newF?: string) => {
    if (!editingFormula) return;
    const p = question.prompt || '';
    const esc = editingFormula.replace(/&/g, '&amp;');
    const rep = newF ? `$${newF}$` : '';
    onUpdate({ prompt: p.includes(`$${editingFormula}$`) ? p.replace(`$${editingFormula}$`, rep) : p.replace(`$${esc}$`, rep) });
  };

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>Question #{index + 1}</span>
          <div style={{ minWidth: 160 }}>
            <SelectDropdown
              value={question.type} options={typeOptions}
              onChange={(v) => onUpdate({
                type: v as Question['type'],
                options: v === 'multiple_choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] : v === 'true_false' ? ['True', 'False'] : undefined,
                correctAnswer: v === 'true_false' ? 'True' : 'Option A',
              })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Marks:</span>
            <input
              type="number" min={1} value={question.points}
              onChange={(e) => onUpdate({ points: Math.max(1, Number(e.target.value) || 1) })}
              style={{ width: 60, padding: '5px 8px', fontSize: '0.88rem', fontWeight: 600, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
            />
          </div>
          {onDone && <Button type="button" variant="primary" size="sm" icon={<Check size={16} />} onClick={onDone}>Done</Button>}
          {totalQuestions > 1 && <Button type="button" variant="danger" size="sm" icon={<Trash size={16} />} onClick={onDelete} aria-label="Delete question" />}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Question Prompt & Equation Text</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsFormulaOpen(true)} icon={<FunctionIcon size={15} />}>Insert Formula</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsPreview(!isPreview)} icon={<Eye size={15} />}>{isPreview ? 'Editor' : 'Live Preview'}</Button>
          </div>
        </div>

        {isPreview ? (
          <div style={{ padding: 14, background: 'var(--color-bg)', borderRadius: 6, minHeight: 90 }}>
            <RichContent html={question.prompt || '*(Empty prompt)*'} />
          </div>
        ) : (
          <TextEditor placeholder="Type question text (use $math$ or Insert Formula)..." value={question.prompt} onChange={(html) => onUpdate({ prompt: html })} onEditFormula={(f) => setEditingFormula(f)} minHeight={90} />
        )}
      </div>

      <QuestionImageUploader imageUrl={question.imageUrl} imageCaption={question.imageCaption} onChange={onUpdate} />
      <QuestionOptionsEditor question={question} onUpdate={onUpdate} />
      <FormulaPaletteModal isOpen={isFormulaOpen} onClose={() => setIsFormulaOpen(false)} onInsert={handleInsertSnippet} />
      <FormulaInteractiveEditorModal isOpen={Boolean(editingFormula)} onClose={() => setEditingFormula(null)} formula={editingFormula || ''} onSave={(nf) => updateFormula(nf)} onDelete={() => updateFormula()} />
    </Card>
  );
};
