import React from 'react';
import { Question } from '@cbt/shared';

interface Props {
  questions: Question[];
}

export const AssessmentQuestionsPreview: React.FC<Props> = ({ questions }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {questions.map((q, idx) => (
      <div key={q.id} className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Q{idx + 1}</span>
            <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
              {q.type.replace('_', ' ')}
            </span>
          </div>
          <span className="badge badge-primary">{q.points} pt{q.points !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ fontSize: '0.95rem', lineHeight: 1.5, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: q.prompt }} />
        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          Correct answer: <b style={{color: 'var(--color-success)'}}>{q.correctAnswer}</b>
        </div>
      </div>
    ))}
  </div>
);
