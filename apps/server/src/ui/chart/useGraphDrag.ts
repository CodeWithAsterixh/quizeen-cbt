import { useState, useRef, useCallback, useEffect } from 'react';
import { LogEntry } from '../types';
import { ChartViewport, CrosshairState } from './chartTypes';
import { getVisibleSlice } from './chartGeometry';

export function useGraphDrag(logs: LogEntry[], containerWidth: number, containerHeight: number) {
  const [offset, setOffset] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isLive, setIsLive] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [crosshair, setCrosshair] = useState<CrosshairState | null>(null);

  const dragStartRef = useRef<{ x: number; initOffset: number } | null>(null);
  const viewport: ChartViewport = { offset, zoom, width: containerWidth, height: containerHeight };

  useEffect(() => {
    if (isLive) setOffset(0);
  }, [logs.length, isLive]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStartRef.current = { x: e.clientX, initOffset: offset };
    setIsDragging(true);
    setIsLive(false);
  }, [offset]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragStartRef.current && isDragging) {
      const deltaPx = e.clientX - dragStartRef.current.x;
      const pointSpacing = 28 * zoom;
      const deltaPoints = Math.round(deltaPx / pointSpacing);
      const newOffset = Math.max(0, dragStartRef.current.initOffset + deltaPoints);
      setOffset(newOffset);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const plotWidth = containerWidth - 55;

    if (mouseX >= 0 && mouseX <= plotWidth && logs.length > 0) {
      const { visibleLogs, startIndex } = getVisibleSlice(logs, viewport);
      if (visibleLogs.length > 0) {
        const stepX = visibleLogs.length > 1 ? plotWidth / (visibleLogs.length - 1) : plotWidth;
        const localIdx = Math.max(0, Math.min(visibleLogs.length - 1, Math.round(mouseX / stepX)));
        const point = visibleLogs[localIdx];
        setCrosshair({ x: localIdx * stepX, y: mouseY, point, pointIndex: startIndex + localIdx });
      }
    } else {
      setCrosshair(null);
    }
  }, [isDragging, zoom, containerWidth, logs, viewport]);

  const onPointerUp = useCallback(() => {
    dragStartRef.current = null;
    setIsDragging(false);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.4, Math.min(3.5, prev - e.deltaY * 0.0015)));
    setIsLive(false);
  }, []);

  const jumpToLive = useCallback(() => {
    setOffset(0);
    setZoom(1);
    setIsLive(true);
  }, []);

  return {
    viewport, isLive, isDragging, crosshair,
    onPointerDown, onPointerMove, onPointerUp, onWheel,
    jumpToLive, setZoom,
  };
}
