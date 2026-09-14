import { Pi as PiIcon } from '@phosphor-icons/react';
import { AngleMode } from './types';

interface Props {
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  onUnary: (func: string) => void;
  onInputChar: (char: string) => void;
}

export function CalcSciGrid({ angleMode, onToggleAngleMode, onUnary, onInputChar }: Props) {
  return (
    <div className="calc-sci-grid">
      <button type="button" className="calc-btn calc-btn-mode" onClick={onToggleAngleMode} title="Toggle Angle Mode">
        {angleMode}
      </button>
      <button type="button" className="calc-btn calc-btn-sci" onClick={() => onUnary('sin')}>sin</button>
      <button type="button" className="calc-btn calc-btn-sci" onClick={() => onUnary('cos')}>cos</button>
      <button type="button" className="calc-btn calc-btn-sci" onClick={() => onUnary('tan')}>tan</button>
      <button type="button" className="calc-btn calc-btn-sci" onClick={() => onInputChar('π')} title="Pi Constant">
        <PiIcon weight="duotone" size={14} />
      </button>
      <button type="button" className="calc-btn calc-btn-sci" onClick={() => onUnary('ln')}>ln</button>
      <button type="button" className="calc-btn calc-btn-sci" onClick={() => onUnary('log')}>log</button>
      <button type="button" className="calc-btn calc-btn-sci" onClick={() => onUnary('sqrt')}>√x</button>
      <button type="button" className="calc-btn calc-btn-sci" onClick={() => onUnary('sqr')}>x²</button>
      <button type="button" className="calc-btn calc-btn-sci" onClick={() => onInputChar('e')}>e</button>
    </div>
  );
}
