import React from 'react';
import { Button } from '@cbt/shared';

interface ClassSelectorProps {
  selectedClass: string;
  classes: string[];
  onSelectClass: (cls: string) => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  selectedClass,
  classes,
  onSelectClass,
}) => {
  const cols = classes.length > 4 ? 3 : Math.max(1, classes.length);

  return (
    <fieldset style={{ border: 'none', margin: '0 0 16px 0', padding: 0 }}>
      <legend className="cbt-input-label" style={{ marginBottom: 8 }}>
        Choose your class:
      </legend>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
        {classes.map((cls) => {
          const isSelected = selectedClass === cls;
          return (
            <Button
              key={cls}
              type="button"
              variant={isSelected ? 'primary' : 'secondary'}
              onClick={() => onSelectClass(cls)}
              aria-pressed={isSelected}
              style={{
                padding: '0.65rem 0.5rem',
                fontWeight: 600,
                fontSize: '0.875rem',
                justifyContent: 'center',
              }}
            >
              {cls}
            </Button>
          );
        })}
      </div>
    </fieldset>
  );
};

