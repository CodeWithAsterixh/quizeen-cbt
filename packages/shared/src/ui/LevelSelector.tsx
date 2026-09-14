import React from 'react';
import { Buildings } from './icons.js';
import { EDUCATION_LEVELS, EducationLevel } from '../types/index.js';
import { Button } from './Button.js';

interface LevelSelectorProps {
  selectedLevel: EducationLevel;
  onSelectLevel: (level: EducationLevel) => void;
  legendText?: string;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevel,
  onSelectLevel,
  legendText = 'Which school level are you in?',
}) => {
  return (
    <fieldset style={{ border: 'none', margin: '0 0 16px 0', padding: 0 }}>
      <legend className="cbt-input-label" style={{ marginBottom: 8, fontWeight: 600 }}>
        {legendText}
      </legend>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {EDUCATION_LEVELS.map((lvl) => {
          const isSelected = selectedLevel === lvl.id;
          return (
            <Button
              key={lvl.id}
              type="button"
              variant={isSelected ? 'primary' : 'secondary'}
              onClick={() => onSelectLevel(lvl.id)}
              aria-pressed={isSelected}
              style={{
                padding: '10px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Buildings size={22} weight={isSelected ? 'fill' : 'regular'} />
              <span>{lvl.shortLabel}</span>
            </Button>
          );
        })}
      </div>
    </fieldset>
  );
};
