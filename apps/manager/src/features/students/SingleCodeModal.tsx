import React, { useState } from 'react';
import { Copy, Check, IdentificationBadge } from '@phosphor-icons/react';
import { Student, Modal, Button, Badge } from '@cbt/shared';

interface Props {
  isOpen: boolean;
  student: Student | null;
  code: string;
  onClose: () => void;
}

export const SingleCodeModal: React.FC<Props> = ({ isOpen, student, code, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !student) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generated Student ID" maxWidth={440}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', padding: '12px 0' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
          <IdentificationBadge size={34} weight="duotone" />
        </div>

        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)' }}>{student.name}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
            {student.classGroup} {student.department ? `• ${student.department}` : ''}
          </div>
        </div>

        <div style={{ background: 'var(--color-surface-hover)', border: '2px dashed var(--color-primary)', borderRadius: 'var(--radius-md)', padding: '14px 28px', width: '100%', maxWidth: 320 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>
            Candidate Login Code
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: 8, color: 'var(--color-primary)' }}>
            {code}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={handleCopy} icon={copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}>
            {copied ? 'Copied to Clipboard' : 'Copy Code'}
          </Button>
          <Button variant="primary" onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
};
