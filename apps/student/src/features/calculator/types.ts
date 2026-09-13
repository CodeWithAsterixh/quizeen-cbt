export type AngleMode = 'DEG' | 'RAD';

export interface CalcPosition {
  x: number;
  y: number;
}

export interface CalcSize {
  width: number;
  height: number;
}

export interface CalcState {
  expression: string;
  display: string;
  angleMode: AngleMode;
  isEvaluated: boolean;
}

export const DEFAULT_CALC_SIZE: CalcSize = {
  width: 340,
  height: 480,
};

export const MIN_CALC_SIZE: CalcSize = {
  width: 300,
  height: 420,
};

export const MAX_CALC_SIZE: CalcSize = {
  width: 520,
  height: 640,
};
