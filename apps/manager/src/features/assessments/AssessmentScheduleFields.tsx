import React from 'react';
import { Card, TextInput, Button } from '@cbt/shared';
import { CheckCircle, XCircle, CalendarBlank } from '@phosphor-icons/react';

interface AssessmentScheduleFieldsProps {
  isAvailable: boolean;
  setIsAvailable: (v: boolean) => void;
  availableFrom: string;
  setAvailableFrom: (v: string) => void;
  availableTo: string;
  setAvailableTo: (v: string) => void;
}

export const AssessmentScheduleFields: React.FC<AssessmentScheduleFieldsProps> = ({
  isAvailable, setIsAvailable, availableFrom, setAvailableFrom, availableTo, setAvailableTo,
}) => {
  return (
    <Card accent="none" style={{ display: 'flex', flexDirection: 'column', gap: 14, background: 'var(--color-bg-subtle, #f8fafc)', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarBlank size={20} color="var(--color-primary)" weight="duotone" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>
            Assessment Availability & Schedule
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button
            type="button"
            size="sm"
            variant={isAvailable ? 'primary' : 'outline'}
            onClick={() => setIsAvailable(true)}
            icon={<CheckCircle size={16} weight="bold" />}
          >
            Available (Active)
          </Button>
          <Button
            type="button"
            size="sm"
            variant={!isAvailable ? 'danger' : 'outline'}
            onClick={() => setIsAvailable(false)}
            icon={<XCircle size={16} weight="bold" />}
          >
            Unavailable (Hidden)
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <TextInput
          type="datetime-local"
          label="Available From (Optional)"
          value={availableFrom}
          onChange={(e) => setAvailableFrom(e.target.value)}
          helperText="Students cannot open before this time"
        />
        <TextInput
          type="datetime-local"
          label="Available Until (Optional)"
          value={availableTo}
          onChange={(e) => setAvailableTo(e.target.value)}
          helperText="Assessment closes after this time"
        />
      </div>
    </Card>
  );
};
