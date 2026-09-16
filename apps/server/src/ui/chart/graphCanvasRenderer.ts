import { LogEntry } from '../types';
import { ChartViewport, CrosshairState, ChartTheme } from './chartTypes';
import { getVisibleSlice, computeYScale } from './chartGeometry';

export function renderGraphCanvas(
  ctx: CanvasRenderingContext2D, logs: LogEntry[], vp: ChartViewport,
  crosshair: CrosshairState | null, metric: 'latency' | 'status', theme: ChartTheme
) {
  const { width, height } = vp;
  ctx.clearRect(0, 0, width, height);
  if (logs.length === 0) return;

  const rightGutter = 55;
  const bottomGutter = 28;
  const plotWidth = width - rightGutter;
  const { visibleLogs, startIndex } = getVisibleSlice(logs, vp);
  if (visibleLogs.length === 0) return;

  const { maxVal, getY } = computeYScale(visibleLogs, metric, height, bottomGutter, 20);
  const stepX = visibleLogs.length > 1 ? plotWidth / (visibleLogs.length - 1) : plotWidth;

  // Grid lines
  ctx.strokeStyle = theme.gridLine; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const val = (maxVal / gridSteps) * i, y = getY(val);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(plotWidth, y); ctx.stroke();
    ctx.fillStyle = theme.axisText; ctx.font = '10px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`${Math.round(val)}${metric === 'latency' ? 'ms' : ''}`, plotWidth + 6, y + 3);
  }
  ctx.setLineDash([]);

  // Area path
  ctx.beginPath();
  visibleLogs.forEach((log, idx) => {
    const x = idx * stepX;
    const val = metric === 'latency' ? log.durationMs : (log.status < 400 ? 1 : 0);
    const y = getY(val);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, height - bottomGutter);
  grad.addColorStop(0, theme.areaGradTop);
  grad.addColorStop(1, theme.areaGradBottom);
  ctx.save();
  ctx.lineTo((visibleLogs.length - 1) * stepX, height - bottomGutter);
  ctx.lineTo(0, height - bottomGutter);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Line stroke
  ctx.beginPath();
  visibleLogs.forEach((log, idx) => {
    const x = idx * stepX;
    const val = metric === 'latency' ? log.durationMs : (log.status < 400 ? 1 : 0);
    const y = getY(val);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = theme.lineStroke;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Point markers
  visibleLogs.forEach((log, idx) => {
    const x = idx * stepX;
    const val = metric === 'latency' ? log.durationMs : (log.status < 400 ? 1 : 0);
    const y = getY(val);
    ctx.beginPath();
    ctx.arc(x, y, log.status >= 400 ? 4.5 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = log.status >= 400 ? theme.errorPoint : theme.successPoint;
    ctx.fill();
  });

  // Crosshair
  if (crosshair && crosshair.point) {
    const localIdx = crosshair.pointIndex - startIndex;
    if (localIdx >= 0 && localIdx < visibleLogs.length) {
      const cx = localIdx * stepX;
      const cy = getY(metric === 'latency' ? crosshair.point.durationMs : (crosshair.point.status < 400 ? 1 : 0));
      ctx.strokeStyle = theme.crosshair;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, 0); ctx.lineTo(cx, height - bottomGutter);
      ctx.moveTo(0, cy); ctx.lineTo(plotWidth, cy);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}
