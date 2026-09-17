import React from 'react';
import { Button } from './Button.js';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
  minHeight?: number;
  fullScreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth,
  minHeight,
  fullScreen = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className={`cbt-modal-backdrop ${fullScreen ? 'fullscreen' : ''}`} role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className={`cbt-modal-dialog ${fullScreen ? 'fullscreen' : ''}`}
        style={!fullScreen ? { maxWidth, minHeight } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="cbt-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <h2 className="cbt-modal-title">{title}</h2>
              {subtitle && (
                <div style={{ fontSize: '0.85rem', color: 'var(--cbt-text-muted)', marginTop: 2 }}>
                  {subtitle}
                </div>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="cbt-modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </header>

        <div className="cbt-modal-body modal-body">{children}</div>
        {footer && <footer className="cbt-modal-footer modal-footer">{footer}</footer>}
      </div>
    </div>
  );
};
