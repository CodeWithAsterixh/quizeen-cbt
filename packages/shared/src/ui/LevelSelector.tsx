import React from 'react';
import { Buildings, GraduationCap, IdentificationBadge } from './icons.js';
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
          const weight = isSelected ? 'fill' : 'regular';
          const icon = lvl.id === 'junior_secondary'
            ? <Buildings size={22} weight={weight} />
            : lvl.id === 'senior_secondary'
            ? <GraduationCap size={22} weight={weight} />
            : <IdentificationBadge size={22} weight={weight} />;

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
              {icon}
              <span>{lvl.shortLabel}</span>
            </Button>
          );
        })}
      </div>
    </fieldset>
  );
};
