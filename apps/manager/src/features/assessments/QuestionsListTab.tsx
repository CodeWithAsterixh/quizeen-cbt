import React from 'react';
import { Plus } from '@cbt/shared';
import { Question, Button } from '@cbt/shared';
import { QuestionPreviewCard } from './QuestionPreviewCard';

interface QuestionsListTabProps {
  questions: Question[];
  editingIndex: number | null;
  setEditingIndex: (idx: number | null) => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (index: number, updated: Partial<Question>) => void;
  onDeleteQuestion: (index: number) => void;
}

export const QuestionsListTab: React.FC<QuestionsListTabProps> = ({
  questions, editingIndex, setEditingIndex, onAddQuestion, onUpdateQuestion, onDeleteQuestion,
}) => {
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, paddingBottom: 6 }}>
        <div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Questions ({questions.length})
          </span>
          <span style={{ marginLeft: 8, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Total Marks: {totalPoints} pts
          </span>
        </div>
        <Button type="button" variant="primary" size="sm" icon={<Plus size={16} />} onClick={onAddQuestion}>
          Add Question
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {questions.map((q, idx) => (
          <QuestionPreviewCard
            key={q.id || idx}
            question={q}
            index={idx}
            totalQuestions={questions.length}
            isEditing={editingIndex === idx}
            onStartEdit={() => setEditingIndex(idx)}
            onDoneEdit={() => setEditingIndex(null)}
            onUpdate={(upd) => onUpdateQuestion(idx, upd)}
            onDelete={() => onDeleteQuestion(idx)}
          />
        ))}
      </div>
    </div>
  );
};
