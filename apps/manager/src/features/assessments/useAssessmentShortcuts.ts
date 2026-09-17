import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onSave: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export function useAssessmentShortcuts({ isOpen, onSave, onUndo, onRedo }: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;

      const key = e.key.toLowerCase();
      const shift = e.shiftKey;

      if (key === 's' && !shift && !e.altKey) {
        e.preventDefault();
        onSave();
        return;
      }

      const target = document.activeElement;
      const isTyping = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.getAttribute('contenteditable') === 'true'
      );

      if (!isTyping) {
        if (key === 'z' && !shift) {
          e.preventDefault();
          onUndo?.();
        } else if ((key === 'y' && !shift) || (key === 'z' && shift)) {
          e.preventDefault();
          onRedo?.();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onSave, onUndo, onRedo]);
}
