import { useState } from 'react';
import { Calculator as CalcIcon, X as CloseIcon, ArrowsOutSimple as ResizeIcon, DotsSixVertical as DragIcon } from '@phosphor-icons/react';
import { AngleMode } from './types';
import { evaluateExpression, applyUnaryFunction } from './calc-engine';
import { CalcKeypad } from './calc-keypad';
import { useFloatingPanel } from './use-floating-panel';
import { useCalculator } from './use-calculator';

interface FloatingCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FloatingCalculator({ isOpen, onClose }: FloatingCalculatorProps) {
  const { pos, size, handleDragStart, handleResizeStart } = useFloatingPanel();
  const {
    expr, display, angleMode, toggleAngleMode,
    handleInputChar, handleOperator, handleClear,
    handleBackspace, handleEvaluate, handleUnary,
  } = useCalculator();

  if (!isOpen) return null;

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
        onToggleAngleMode={toggleAngleMode}
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
