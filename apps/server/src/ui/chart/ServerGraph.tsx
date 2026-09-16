import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { ChartTheme } from './chartTypes';
import { renderGraphCanvas } from './graphCanvasRenderer';
import { useGraphDrag } from './useGraphDrag';
import { GraphControls } from './GraphControls';
import { GraphTooltip } from './GraphTooltip';

interface Props {
  logs: LogEntry[];
  metric: 'latency' | 'status';
}

const theme: ChartTheme = {
  bg: 'transparent',
  gridLine: 'rgba(150, 150, 150, 0.16)',
  axisText: 'rgba(150, 150, 150, 0.85)',
  lineStroke: 'var(--color-primary, #059669)',
  areaGradTop: 'rgba(16, 185, 129, 0.25)',
  areaGradBottom: 'rgba(16, 185, 129, 0.01)',
  errorPoint: '#ef4444',
  successPoint: '#10b981',
  crosshair: 'rgba(245, 158, 11, 0.75)',
  pillBg: 'var(--color-surface)',
  pillText: 'var(--color-text)',
};

export const ServerGraph: React.FC<Props> = ({ logs, metric }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const height = 240;
  const width = 760;

  const {
    viewport, isLive, isDragging, crosshair,
    onPointerDown, onPointerMove, onPointerUp, onWheel,
    jumpToLive, setZoom,
  } = useGraphDrag(logs, width, height);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    renderGraphCanvas(ctx, logs, viewport, crosshair, metric, theme);
  }, [logs, viewport, crosshair, metric]);

  if (logs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-subtle)' }}>
        No request data yet. Start the server and send requests to view activity.
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      <GraphControls
        isLive={isLive}
        zoom={viewport.zoom}
        offset={viewport.offset}
        onJumpToLive={jumpToLive}
        onZoomIn={() => setZoom((z) => Math.min(3.5, z + 0.25))}
        onZoomOut={() => setZoom((z) => Math.max(0.4, z - 0.25))}
      />

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
        style={{
          width: '100%', height, overflow: 'hidden', position: 'relative',
          cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none',
          touchAction: 'none', background: 'var(--color-surface)',
          borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)',
        }}
      >
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      <GraphTooltip
        log={crosshair?.point ?? (logs.length > 0 ? logs[logs.length - 1] : null)}
        totalLogs={logs.length}
        currentIndex={crosshair ? crosshair.pointIndex : logs.length - 1}
      />
    </div>
  );
};
