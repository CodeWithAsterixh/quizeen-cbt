import React, { useState } from 'react';
import { Question, RichContent, NumberInput, TextEditor } from '@cbt/shared';
import { Check, X, CaretDown } from '@cbt/shared';

interface GradeQuestionItemProps {
  question: Question;
  index: number;
  studentAnswer: string;
  awardedPoints: number;
  remarks: string;
  onPointsChange: (points: number) => void;
  onRemarksChange: (remarks: string) => void;
}

export const GradeQuestionItem: React.FC<GradeQuestionItemProps> = ({
  question, index, studentAnswer, awardedPoints, remarks, onPointsChange, onRemarksChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFull = awardedPoints === question.points;
  const isZero = awardedPoints === 0;
  const isMatched = studentAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

  return (
    <div className="card" style={{ marginBottom: '0.75rem', padding: '1rem 1.15rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>Q{index + 1}</span>
          <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>{question.type.replace('_', ' ')}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {question.prompt.replace(/<[^>]*>/g, '')}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <span className={`badge ${isFull ? 'badge-success' : isZero ? 'badge-danger' : 'badge-warning'}`}>
            {awardedPoints} / {question.points} pts
          </span>
          <button type="button" className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}>
            <span>{isOpen ? 'Hide' : 'Grade'}</span>
            <CaretDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.95rem', marginBottom: '0.85rem', lineHeight: 1.5 }}><RichContent html={question.prompt} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--color-surface-hover)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: `1px solid ${isMatched ? 'var(--color-success)' : 'var(--color-border)'}` }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Student Answer</div>
              <div style={{ fontWeight: 600, fontSize: '0.925rem', color: isMatched ? 'var(--color-success)' : 'var(--color-text)' }}>
                {studentAnswer || <span style={{ color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>No response</span>}
              </div>
            </div>
            <div style={{ background: 'var(--color-surface-hover)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Reference Answer</div>
              <div style={{ fontWeight: 600, fontSize: '0.925rem', color: 'var(--color-success)' }}>{question.correctAnswer}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', background: 'var(--color-surface-hover)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Award Score:</span>
              <div style={{ width: '100px' }}><NumberInput min={0} max={question.points} value={awardedPoints} onChange={onPointsChange} /></div>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>/ {question.points} pts</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className={`btn btn-sm ${isFull ? 'btn-primary' : 'btn-outline'}`} onClick={() => onPointsChange(question.points)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Check size={14} /><span>Full ({question.points})</span>
              </button>
              <button type="button" className={`btn btn-sm ${isZero ? 'btn-secondary' : 'btn-outline'}`} onClick={() => onPointsChange(0)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <X size={14} /><span>Zero (0)</span>
              </button>
            </div>
          </div>

          <TextEditor label="Teacher Remarks & Feedback" value={remarks} onChange={onRemarksChange} placeholder="Add feedback or remarks for this response..." minHeight={70} />
        </div>
      )}
    </div>
  );
};
