import React from 'react';

export interface ShortcutHandlers {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onFormula?: () => void;
  onChange?: () => void;
}

const CMD_MAP: Record<string, string> = {
  b: 'bold', i: 'italic', u: 'underline',
  e: 'justifyCenter', l: 'justifyLeft', r: 'justifyRight', j: 'justifyFull',
};

export const handleWordShortcut = (
  e: React.KeyboardEvent | KeyboardEvent,
  h: ShortcutHandlers = {}
): boolean => {
  if (!e.ctrlKey && !e.metaKey) return false;
  const k = e.key.toLowerCase(), s = e.shiftKey, a = e.altKey;

  if (k === 's' && !s && !a) {
    e.preventDefault(); h.onSave?.(); return true;
  }
  if (k === 'z' && !s && !a) {
    e.preventDefault(); h.onUndo ? h.onUndo() : document.execCommand('undo', false);
    h.onChange?.(); return true;
  }
  if ((k === 'y' && !s && !a) || (k === 'z' && s && !a)) {
    e.preventDefault(); h.onRedo ? h.onRedo() : document.execCommand('redo', false);
    h.onChange?.(); return true;
  }
  if (!s && !a && CMD_MAP[k]) {
    e.preventDefault(); document.execCommand(CMD_MAP[k], false);
    h.onChange?.(); return true;
  }
  if ((k === 'l' && s) || (k === '8' && s) || (k === '*' && s)) {
    e.preventDefault(); document.execCommand('insertUnorderedList', false);
    h.onChange?.(); return true;
  }
  if (k === '7' && s) {
    e.preventDefault(); document.execCommand('insertOrderedList', false);
    h.onChange?.(); return true;
  }
  if (a && (k === '1' || k === '2' || k === '3')) {
    e.preventDefault(); document.execCommand('formatBlock', false, `<h${k}>`);
    h.onChange?.(); return true;
  }
  if (a && k === '0') {
    e.preventDefault(); document.execCommand('formatBlock', false, '<p>');
    h.onChange?.(); return true;
  }
  if (k === 'k' && !s && !a && h.onFormula) {
    e.preventDefault(); h.onFormula(); return true;
  }
  return false;
};
