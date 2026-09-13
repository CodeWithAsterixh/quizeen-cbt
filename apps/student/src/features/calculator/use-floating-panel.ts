import { useState, useCallback } from 'react';
import { CalcPosition, CalcSize, DEFAULT_CALC_SIZE, MIN_CALC_SIZE, MAX_CALC_SIZE } from './types';

export function useFloatingPanel() {
  const [pos, setPos] = useState<CalcPosition>(() => ({
    x: Math.max(20, window.innerWidth - DEFAULT_CALC_SIZE.width - 30),
    y: 75,
  }));
  const [size, setSize] = useState<CalcSize>(DEFAULT_CALC_SIZE);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX - pos.x;
    const startY = e.clientY - pos.y;

    const onMove = (moveEv: MouseEvent) => {
      const nextX = Math.max(10, Math.min(window.innerWidth - size.width - 10, moveEv.clientX - startX));
      const nextY = Math.max(10, Math.min(window.innerHeight - size.height - 10, moveEv.clientY - startY));
      setPos({ x: nextX, y: nextY });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [pos.x, pos.y, size.width, size.height]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = size.width;
    const initialHeight = size.height;

    const onMove = (moveEv: MouseEvent) => {
      const nextW = Math.max(MIN_CALC_SIZE.width, Math.min(MAX_CALC_SIZE.width, initialWidth + (moveEv.clientX - startX)));
      const nextH = Math.max(MIN_CALC_SIZE.height, Math.min(MAX_CALC_SIZE.height, initialHeight + (moveEv.clientY - startY)));
      setSize({ width: nextW, height: nextH });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [size.width, size.height]);

  return { pos, size, handleDragStart, handleResizeStart };
}
