import React from 'react';
import { Buildings, GraduationCap, IdentificationBadge } from '@cbt/shared';
import { EDUCATION_LEVELS, EducationLevel, Button } from '@cbt/shared';

interface LevelSelectorProps {
  selectedLevel: EducationLevel;
  onSelectLevel: (level: EducationLevel) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ selectedLevel, onSelectLevel }) => {
  return (
    <fieldset style={{ border: 'none', margin: '0 0 16px 0', padding: 0 }}>
      <legend className="cbt-input-label" style={{ marginBottom: 8 }}>
        Which school level are you in?
      </legend>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {EDUCATION_LEVELS.map((lvl) => {
          const isSelected = selectedLevel === lvl.id;
          const weight = isSelected ? 'fill' : 'regular';
          const iconColor = isSelected ? 'var(--color-surface)' : 'var(--color-text-muted)';
          const icon = lvl.id === 'junior_secondary'
            ? <Buildings size={24} weight={weight} color={iconColor} />
            : lvl.id === 'senior_secondary'
            ? <GraduationCap size={24} weight={weight} color={iconColor} />
            : <IdentificationBadge size={24} weight={weight} color={iconColor} />;

          return (
            <Button
              key={lvl.id}
              type="button"
              variant={isSelected ? 'primary' : 'secondary'}
              onClick={() => onSelectLevel(lvl.id)}
              aria-pressed={isSelected}
              style={{
                padding: '12px 10px',
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
