import { useState } from 'react';
import { Calculator as CalcIcon, X as CloseIcon, ArrowsOutSimple as ResizeIcon, DotsSixVertical as DragIcon } from '@phosphor-icons/react';
import { AngleMode } from './types';
import { evaluateExpression, applyUnaryFunction } from './calc-engine';
import { CalcKeypad } from './calc-keypad';
import { useFloatingPanel } from './use-floating-panel';

interface FloatingCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FloatingCalculator({ isOpen, onClose }: FloatingCalculatorProps) {
  const { pos, size, handleDragStart, handleResizeStart } = useFloatingPanel();
  const [expr, setExpr] = useState('');
  const [display, setDisplay] = useState('0');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [isResult, setIsResult] = useState(false);

  if (!isOpen) return null;

  const handleInputChar = (char: string) => {
    if (isResult) {
      if (/[0-9.]/.test(char)) { setDisplay(char); setExpr(''); }
      else { setExpr(display + ' ' + char + ' '); setDisplay('0'); }
      setIsResult(false);
      return;
    }
    setDisplay((prev) => (prev === '0' && char !== '.' ? char : prev + char));
  };

  const handleOperator = (op: string) => {
    setExpr((prev) => `${prev} ${display} ${op}`.trim());
    setDisplay('0');
    setIsResult(false);
  };

  const handleClear = () => { setDisplay('0'); setExpr(''); setIsResult(false); };
  const handleBackspace = () => setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));

  const handleEvaluate = () => {
    const fullExpr = expr ? `${expr} ${display}` : display;
    const res = evaluateExpression(fullExpr);
    setExpr(fullExpr + ' =');
    setDisplay(res);
    setIsResult(true);
  };

  const handleUnary = (func: string) => {
    const res = applyUnaryFunction(display, func, angleMode);
    setDisplay(res);
    setIsResult(true);
  };

  return (
    <div
      className="calc-window"
      style={{ left: pos.x, top: pos.y, width: size.width, height: size.height }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="calc-header" onMouseDown={handleDragStart}>
        <div className="calc-header-title">
          <DragIcon weight="bold" size={14} className="calc-drag-handle" />
          <CalcIcon weight="duotone" size={16} />
          <span>Scientific Calculator</span>
        </div>
        <button type="button" className="calc-close-btn" onClick={onClose} title="Close Calculator">
          <CloseIcon weight="bold" size={13} />
        </button>
      </div>

      <div className="calc-screen">
        <div className="calc-expr">{expr || '\u00A0'}</div>
        <div className="calc-display">{display}</div>
      </div>

      <CalcKeypad
        angleMode={angleMode}
        onToggleAngleMode={() => setAngleMode((m) => (m === 'DEG' ? 'RAD' : 'DEG'))}
        onInputChar={(c) => (['+', '-', '×', '÷'].includes(c) ? handleOperator(c) : handleInputChar(c))}
        onUnary={handleUnary}
        onClear={handleClear}
        onBackspace={handleBackspace}
        onEvaluate={handleEvaluate}
      />

      <div className="calc-resize-handle" onMouseDown={handleResizeStart} title="Resize">
        <ResizeIcon weight="bold" size={12} />
      </div>
    </div>
  );
}
