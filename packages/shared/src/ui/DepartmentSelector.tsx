import React from 'react';
import { Compass } from './icons.js';
import { DEPARTMENTS, Department } from '../types/index.js';
import { Button } from './Button.js';

interface DepartmentSelectorProps {
  department?: Department | '';
  onSelectDepartment: (dept: any) => void;
  legendText?: string;
  allowAll?: boolean;
  allLabel?: string;
}

export const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  department,
  onSelectDepartment,
  legendText = 'What is your department stream?',
  allowAll = false,
  allLabel = 'All Departments (General)',
}) => {
  const list = allowAll ? [{ id: '' as any, name: allLabel }, ...DEPARTMENTS] : DEPARTMENTS;

  return (
    <fieldset style={{ background: 'var(--color-surface)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', margin: '0 0 16px 0' }}>
      <legend style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: 'var(--color-primary)', padding: '0 6px', fontSize: '0.85rem' }}>
        <Compass size={18} weight="fill" />
        <span>{legendText}</span>
      </legend>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 6 }}>
        {list.map((dept) => {
          const isSelected = (department ?? '') === dept.id;
          return (
            <Button
              key={dept.id || 'all'}
              type="button"
              variant={isSelected ? 'primary' : 'secondary'}
              onClick={() => onSelectDepartment(dept.id)}
              aria-pressed={isSelected}
              style={{ textAlign: 'center', justifyContent: 'center' }}
            >
              {dept.name}
            </Button>
          );
        })}
      </div>
    </fieldset>
  );
};
