import React from 'react';
import { PencilSimple, Trash, CheckCircle } from '@cbt/shared';
import { Question, Card, Badge, Button, RichContent } from '@cbt/shared';
import { QuestionItemEditor } from './QuestionItemEditor';

interface QuestionPreviewCardProps {
  question: Question;
  index: number;
  totalQuestions: number;
  isEditing: boolean;
  onStartEdit: () => void;
  onDoneEdit: () => void;
  onUpdate: (updated: Partial<Question>) => void;
  onDelete: () => void;
}

export const QuestionPreviewCard: React.FC<QuestionPreviewCardProps> = ({
  question, index, totalQuestions, isEditing, onStartEdit, onDoneEdit, onUpdate, onDelete,
}) => {
  if (isEditing) {
    return (
      <QuestionItemEditor
        question={question} index={index} totalQuestions={totalQuestions}
        onUpdate={onUpdate} onDelete={onDelete} onDone={onDoneEdit}
      />
    );
  }

  return (
    <Card accent="none" style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-primary)' }}>Q{index + 1}</span>
          <Badge color="blue">{question.type === 'multiple_choice' ? 'Multiple Choice' : question.type === 'true_false' ? 'True / False' : 'Short Answer'}</Badge>
          <Badge color="emerald">{question.points} pt{question.points !== 1 ? 's' : ''}</Badge>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button type="button" variant="primary" size="sm" onClick={onStartEdit} icon={<PencilSimple size={15} />}>
            Edit Question
          </Button>
          {totalQuestions > 1 && (
            <Button type="button" variant="danger" size="sm" onClick={onDelete} icon={<Trash size={15} />} title="Delete Question" />
          )}
        </div>
      </div>

      <div style={{ fontSize: '0.92rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
        <RichContent html={question.prompt || '*(Empty prompt)*'} />
      </div>

      {question.imageUrl && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 6, background: 'var(--color-bg)', borderRadius: 6 }}>
          <img src={question.imageUrl} alt={question.imageCaption || 'Diagram'} style={{ maxHeight: 160, maxWidth: '100%', objectFit: 'contain' }} />
          {question.imageCaption && <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{question.imageCaption}</span>}
        </div>
      )}

      {question.options && question.options.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 6 }}>
          {question.options.map((opt, i) => {
            const isCorrect = opt === question.correctAnswer;
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 6, fontSize: '0.84rem',
                  background: isCorrect ? 'var(--color-bg-subtle, #f0fdf4)' : 'var(--color-bg-alt, #f8fafc)',
                  border: isCorrect ? '1px solid var(--color-success, #10b981)' : '1px solid var(--color-border)',
                  color: isCorrect ? 'var(--color-success, #047857)' : 'var(--color-text-muted)',
                  fontWeight: isCorrect ? 600 : 400,
                }}
              >
                {isCorrect ? <CheckCircle size={15} weight="bold" color="var(--color-success)" /> : <span style={{ opacity: 0.6 }}>{String.fromCharCode(65 + i)}.</span>}
                <RichContent html={opt} inline />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
