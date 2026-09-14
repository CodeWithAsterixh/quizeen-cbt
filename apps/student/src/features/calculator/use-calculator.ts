import { useState } from 'react';
import { AngleMode } from './types';
import { evaluateExpression, applyUnaryFunction } from './calc-engine';

export function useCalculator() {
  const [expr, setExpr] = useState('');
  const [display, setDisplay] = useState('0');
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [isResult, setIsResult] = useState(false);

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

  const toggleAngleMode = () => setAngleMode((m) => (m === 'DEG' ? 'RAD' : 'DEG'));

  return {
    expr, display, angleMode, toggleAngleMode,
    handleInputChar, handleOperator, handleClear,
    handleBackspace, handleEvaluate, handleUnary,
  };
}
