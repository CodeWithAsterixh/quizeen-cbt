import React, { useRef, useEffect } from 'react';
import { formatToCanvas, canvasToValue } from './math-chip-converter.js';
import { handleWordShortcut } from './editor-shortcuts.js';

export interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  label?: string;
  disabled?: boolean;
  onEditFormula?: (formula: string) => void;
  onSave?: () => void;
  onFormula?: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write here...',
  minHeight,
  label,
  disabled = false,
  onEditFormula,
  onSave,
  onFormula,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      const targetHtml = formatToCanvas(value || '');
      if (editorRef.current.innerHTML !== targetHtml) {
        editorRef.current.innerHTML = targetHtml;
      }
    }
  }, [value]);

  const exec = (command: string, arg?: string) => {
    if (disabled) return;
    document.execCommand(command, false, arg);
    if (editorRef.current) onChange(canvasToValue(editorRef.current.innerHTML));
  };

  const handleInput = () => {
    if (editorRef.current) onChange(canvasToValue(editorRef.current.innerHTML));
  };

  const handleClick = (e: React.MouseEvent) => {
    const chip = (e.target as HTMLElement).closest('.cbt-formula-chip');
    if (chip && onEditFormula) {
      e.preventDefault();
      e.stopPropagation();
      const latex = decodeURIComponent(chip.getAttribute('data-latex') || '');
      if (latex) onEditFormula(latex);
    }
  };

  return (
    <div className="cbt-input-group">
      {label && <label className="cbt-input-label">{label}</label>}
      <div className="editor-container">
        {!disabled && (
          <div className="editor-toolbar" role="toolbar" aria-label="Text formatting toolbar">
            <button type="button" className="editor-btn" onClick={() => exec('bold')} style={{ fontWeight: 800 }}>B</button>
            <button type="button" className="editor-btn" onClick={() => exec('italic')} style={{ fontStyle: 'italic' }}>I</button>
            <button type="button" className="editor-btn" onClick={() => exec('underline')} style={{ textDecoration: 'underline' }}>U</button>
            <button type="button" className="editor-btn" onClick={() => exec('formatBlock', '<h3>')}>Heading</button>
            <button type="button" className="editor-btn" onClick={() => exec('insertUnorderedList')}>• Bullet</button>
            <button type="button" className="editor-btn" onClick={() => exec('insertOrderedList')}>1. Numbered</button>
          </div>
        )}
        <div
          ref={editorRef}
          className="editor-canvas"
          contentEditable={!disabled}
          onInput={handleInput}
          onBlur={handleInput}
          onClick={handleClick}
          onKeyDown={(e) => !disabled && handleWordShortcut(e, { onSave, onFormula, onChange: handleInput })}
          data-placeholder={placeholder}
          style={minHeight ? { minHeight: `${minHeight}px` } : undefined}
          tabIndex={0}
          role="textbox"
          aria-multiline="true"
        />
      </div>
    </div>
  );
};
