import React from 'react';

interface Props {
  isLive: boolean;
  zoom: number;
  offset: number;
  onJumpToLive: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const GraphControls: React.FC<Props> = ({
  isLive, zoom, offset, onJumpToLive, onZoomIn, onZoomOut,
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onJumpToLive}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: isLive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: isLive ? 'var(--color-success)' : 'var(--color-warning, #d97706)',
            fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: isLive ? 'var(--color-success)' : '#d97706',
            boxShadow: isLive ? '0 0 6px var(--color-success)' : 'none',
          }} />
          {isLive ? 'LIVE' : `PAUSED (-${offset} req)`}
        </button>

        {!isLive && (
          <button
            onClick={onJumpToLive}
            style={{
              padding: '4px 8px', fontSize: '0.72rem', fontWeight: 600,
              background: 'var(--color-primary)', color: '#fff', border: 'none',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            }}
          >
            Jump to Latest
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-subtle)', marginRight: 4 }}>
          Drag to scrub history | Wheel to zoom
        </span>
        <button
          onClick={onZoomOut}
          style={{
            padding: '3px 8px', fontSize: '0.75rem', fontWeight: 700,
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            color: 'var(--color-text)', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
          }}
          title="Zoom out"
        >
          -
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          style={{
            padding: '3px 8px', fontSize: '0.75rem', fontWeight: 700,
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            color: 'var(--color-text)', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
          }}
          title="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
};
