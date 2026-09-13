import React from 'react';

interface ProfileStepProgressProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export const ProfileStepProgress: React.FC<ProfileStepProgressProps> = ({
  currentStep, totalSteps, title,
}) => {
  const pct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Step {currentStep} of {totalSteps}
        </span>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          {title}
        </span>
      </div>
      <div style={{ height: 4, width: '100%', backgroundColor: 'var(--color-border)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 200ms ease' }} />
      </div>
    </div>
  );
};
