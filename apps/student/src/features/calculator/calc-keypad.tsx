import {
  Backspace as BackspaceIcon,
  ArrowCounterClockwise as ResetIcon,
  Divide as DivideIcon,
  X as MultIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Equals as EqualsIcon,
  PlusMinus as PlusMinusIcon,
  Percent as PercentIcon,
} from '@phosphor-icons/react';
import { AngleMode } from './types';
import { CalcSciGrid } from './calc-sci-grid';

interface CalcKeypadProps {
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  onInputChar: (char: string) => void;
  onUnary: (func: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEvaluate: () => void;
}

export function CalcKeypad({
  angleMode, onToggleAngleMode, onInputChar, onUnary, onClear, onBackspace, onEvaluate,
}: CalcKeypadProps) {
  return (
    <div className="calc-keypad">
      <CalcSciGrid
        angleMode={angleMode}
        onToggleAngleMode={onToggleAngleMode}
        onUnary={onUnary}
        onInputChar={onInputChar}
      />

      <div className="calc-main-grid">
        <button type="button" className="calc-btn calc-btn-action" onClick={onClear} title="Clear">
          <ResetIcon weight="bold" size={15} />
        </button>
        <button type="button" className="calc-btn calc-btn-action" onClick={onBackspace} title="Backspace">
          <BackspaceIcon weight="duotone" size={15} />
        </button>
        <button type="button" className="calc-btn calc-btn-action" onClick={() => onInputChar('%')} title="Percent">
          <PercentIcon weight="bold" size={13} />
        </button>
        <button type="button" className="calc-btn calc-btn-op" onClick={() => onInputChar('÷')}>
          <DivideIcon weight="bold" size={15} />
        </button>

        {['7', '8', '9'].map((n) => (
          <button key={n} type="button" className="calc-btn calc-btn-num" onClick={() => onInputChar(n)}>{n}</button>
        ))}
        <button type="button" className="calc-btn calc-btn-op" onClick={() => onInputChar('×')}>
          <MultIcon weight="bold" size={14} />
        </button>

        {['4', '5', '6'].map((n) => (
          <button key={n} type="button" className="calc-btn calc-btn-num" onClick={() => onInputChar(n)}>{n}</button>
        ))}
        <button type="button" className="calc-btn calc-btn-op" onClick={() => onInputChar('-')}>
          <MinusIcon weight="bold" size={14} />
        </button>

        {['1', '2', '3'].map((n) => (
          <button key={n} type="button" className="calc-btn calc-btn-num" onClick={() => onInputChar(n)}>{n}</button>
        ))}
        <button type="button" className="calc-btn calc-btn-op" onClick={() => onInputChar('+')}>
          <PlusIcon weight="bold" size={14} />
        </button>

        <button type="button" className="calc-btn calc-btn-action" onClick={() => onUnary('neg')} title="Negate">
          <PlusMinusIcon weight="duotone" size={14} />
        </button>
        <button type="button" className="calc-btn calc-btn-num" onClick={() => onInputChar('0')}>0</button>
        <button type="button" className="calc-btn calc-btn-num" onClick={() => onInputChar('.')}>.</button>
        <button type="button" className="calc-btn calc-btn-equals" onClick={onEvaluate}>
          <EqualsIcon weight="bold" size={15} />
        </button>
      </div>
    </div>
  );
}
