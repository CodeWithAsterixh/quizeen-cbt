import { AngleMode } from './types';

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n) || n > 170) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function evaluateExpression(expr: string): string {
  try {
    const clean = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**')
      .replace(/π/g, `${Math.PI}`)
      .replace(/e(?![a-z])/gi, `${Math.E}`);

    if (!/^[0-9+\-*/().\s*]+$/.test(clean)) return 'Error';
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${clean})`)();
    if (typeof result !== 'number' || !isFinite(result)) return 'Error';
    return String(Number(result.toFixed(8)));
  } catch {
    return 'Error';
  }
}

export function applyUnaryFunction(
  valStr: string,
  func: string,
  mode: AngleMode
): string {
  const val = Number(valStr);
  if (isNaN(val)) return 'Error';

  let res: number;
  const toRad = mode === 'DEG' ? Math.PI / 180 : 1;

  switch (func) {
    case 'sin': res = Math.sin(val * toRad); break;
    case 'cos': res = Math.cos(val * toRad); break;
    case 'tan': res = Math.tan(val * toRad); break;
    case 'sqrt': res = val < 0 ? NaN : Math.sqrt(val); break;
    case 'sqr': res = Math.pow(val, 2); break;
    case 'inv': res = val === 0 ? NaN : 1 / val; break;
    case 'ln': res = val <= 0 ? NaN : Math.log(val); break;
    case 'log': res = val <= 0 ? NaN : Math.log10(val); break;
    case 'fact': res = factorial(val); break;
    case 'exp': res = Math.exp(val); break;
    case 'tenPow': res = Math.pow(10, val); break;
    case 'neg': res = -val; break;
    default: return valStr;
  }

  if (isNaN(res) || !isFinite(res)) return 'Error';
  return String(Number(res.toFixed(8)));
}
