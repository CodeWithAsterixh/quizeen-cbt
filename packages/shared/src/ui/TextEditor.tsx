import React, { useRef, useEffect } from 'react';

export interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  label?: string;
  disabled?: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write here...',
  minHeight,
  label,
  disabled = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (command: string, arg?: string) => {
    if (disabled) return;
    document.execCommand(command, false, arg);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="cbt-input-group">
      {label && <label className="cbt-input-label">{label}</label>}
      <div className="editor-container">
        {!disabled && (
          <div className="editor-toolbar" role="toolbar" aria-label="Text formatting toolbar">
            <button type="button" className="editor-btn" onClick={() => exec('bold')} style={{ fontWeight: 800 }}>
              B
            </button>
            <button type="button" className="editor-btn" onClick={() => exec('italic')} style={{ fontStyle: 'italic' }}>
              I
            </button>
            <button type="button" className="editor-btn" onClick={() => exec('underline')} style={{ textDecoration: 'underline' }}>
              U
            </button>
            <button type="button" className="editor-btn" onClick={() => exec('formatBlock', '<h3>')}>
              Heading
            </button>
            <button type="button" className="editor-btn" onClick={() => exec('insertUnorderedList')}>
              • Bullet
            </button>
            <button type="button" className="editor-btn" onClick={() => exec('insertOrderedList')}>
              1. Numbered
            </button>
          </div>
        )}

        <div
          ref={editorRef}
          className="editor-canvas"
          contentEditable={!disabled}
          onInput={handleInput}
          onBlur={handleInput}
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
