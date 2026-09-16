import { LogEntry } from '../types';
import { ChartViewport } from './chartTypes';

export function getVisibleSlice(logs: LogEntry[], viewport: ChartViewport, pointSpacing = 28) {
  const visibleCount = Math.max(8, Math.ceil(viewport.width / (pointSpacing * viewport.zoom)) + 4);
  const total = logs.length;
  const maxOffset = Math.max(0, total - visibleCount);
  const clampedOffset = Math.max(0, Math.min(viewport.offset, maxOffset));
  const startIndex = Math.max(0, total - visibleCount - clampedOffset);
  const endIndex = Math.min(total, total - clampedOffset);
  const visibleLogs = logs.slice(startIndex, endIndex);

  return { visibleLogs, startIndex, endIndex, clampedOffset, maxOffset };
}

export function computeYScale(logs: LogEntry[], metric: 'latency' | 'status', height: number, paddingBottom = 40, paddingTop = 25) {
  const plotHeight = height - paddingBottom - paddingTop;
  const maxVal = metric === 'latency'
    ? Math.max(15, ...logs.map((l) => l.durationMs))
    : 1;
  const minVal = 0;
  const range = Math.max(1, maxVal - minVal);

  const getY = (val: number) => {
    const norm = (val - minVal) / range;
    return height - paddingBottom - norm * plotHeight;
  };

  return { maxVal, minVal, plotHeight, getY };
}
