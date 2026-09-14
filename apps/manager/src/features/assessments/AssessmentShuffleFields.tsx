import React from 'react';
import { Card, Button, ArrowsClockwise, CheckCircle, XCircle } from '@cbt/shared';

interface AssessmentShuffleFieldsProps {
  shuffleQuestions: boolean;
  setShuffleQuestions: (v: boolean) => void;
  shuffleOptions: boolean;
  setShuffleOptions: (v: boolean) => void;
}

export const AssessmentShuffleFields: React.FC<AssessmentShuffleFieldsProps> = ({
  shuffleQuestions,
  setShuffleQuestions,
  shuffleOptions,
  setShuffleOptions,
}) => {
  return (
    <Card accent="none" style={{ display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--color-bg-subtle, #f8fafc)', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ArrowsClockwise size={20} color="var(--color-primary)" weight="duotone" />
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>
          Shuffling
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, background: '#fff', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>
              Shuffle Questions
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            variant={shuffleQuestions ? 'primary' : 'outline'}
            onClick={() => setShuffleQuestions(!shuffleQuestions)}
            icon={shuffleQuestions ? <CheckCircle size={16} weight="bold" /> : <XCircle size={16} weight="bold" />}
          >
            {shuffleQuestions ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, background: '#fff', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>
              Shuffle Options
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            variant={shuffleOptions ? 'primary' : 'outline'}
            onClick={() => setShuffleOptions(!shuffleOptions)}
            icon={shuffleOptions ? <CheckCircle size={16} weight="bold" /> : <XCircle size={16} weight="bold" />}
          >
            {shuffleOptions ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
