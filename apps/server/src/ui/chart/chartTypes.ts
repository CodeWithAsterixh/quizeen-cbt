import { LogEntry } from '../types';

export interface ChartViewport {
  offset: number;
  zoom: number;
  width: number;
  height: number;
}

export interface CrosshairState {
  x: number;
  y: number;
  point: LogEntry | null;
  pointIndex: number;
}

export interface ChartTheme {
  bg: string;
  gridLine: string;
  axisText: string;
  lineStroke: string;
  areaGradTop: string;
  areaGradBottom: string;
  errorPoint: string;
  successPoint: string;
  crosshair: string;
  pillBg: string;
  pillText: string;
}
