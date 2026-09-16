import React from 'react';
import { Button, PencilSimple } from '@cbt/shared';

interface Props {
  icon: React.ReactNode;
  title: string;
  phrase: string;
  onEdit: () => void;
  badge?: string;
}

export const SettingsGroupRow: React.FC<Props> = ({ icon, title, phrase, onEdit, badge }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        background: 'var(--color-surface, #ffffff)',
        border: '1px solid var(--color-border, #e2e8f0)',
        borderRadius: 8,
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 240 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: 'var(--color-surface-hover, #f1f5f9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary, #059669)',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text, #0f172a)' }}>
              {title}
            </span>
            {badge && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: 'var(--color-surface-hover, #f1f5f9)',
                  color: 'var(--color-text-muted, #64748b)',
                }}
              >
                {badge}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--color-text-muted, #64748b)', marginTop: 2 }}>
            {phrase}
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEdit();
        }}
        icon={<PencilSimple size={15} color="var(--color-primary, #059669)" />}
        style={{ whiteSpace: 'nowrap' }}
      >
        Edit
      </Button>
    </div>
  );
};
