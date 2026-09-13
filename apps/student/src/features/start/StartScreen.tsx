import React from 'react';
import { Play, Gear, GraduationCap } from '@phosphor-icons/react';
import { Button, Card } from '@cbt/shared';

interface StartScreenProps {
  onStartExamClick: () => void;
  onOpenSettings: () => void;
  examCount: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartExamClick,
  onOpenSettings,
  examCount,
}) => {
  return (
    <section
      aria-label="Student Welcome Screen"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        flex: 1, padding: '2rem 1.5rem', position: 'relative',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <nav aria-label="Teacher tools" style={{ position: 'absolute', top: 16, right: 20 }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenSettings}
          title="Teacher & Invigilator Settings"
          aria-label="Teacher Settings"
          icon={<Gear size={16} weight="bold" />}
        >
          Teacher Tools
        </Button>
      </nav>

      <Card style={{ maxWidth: 540, width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '2.5rem 2rem' }}>
        <div
          style={{
            width: 72, height: 72, borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <GraduationCap size={40} weight="fill" />
        </div>

        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
            Welcome to Queez
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            Hello candidate! Enter the 6-character Student ID code provided by your teacher to access your tests.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onStartExamClick}
          icon={<Play size={18} weight="fill" />}
          style={{ minWidth: 200 }}
        >
          Enter Student ID
        </Button>

      </Card>
    </section>
  );
};
