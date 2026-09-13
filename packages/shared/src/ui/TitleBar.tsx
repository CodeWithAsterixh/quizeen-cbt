import React from 'react';
import { useTitleBar } from './useTitleBar.js';

const MinusIcon = () => (
  <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor"><rect width="10" height="2" /></svg>
);
const SquareIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="8" height="8" /></svg>
);
const RestoreIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2.5" y="0.5" width="7" height="7" /><path d="M0.5 2.5v7h7" /></svg>
);
const CloseIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" /></svg>
);

export interface TitleBarProps {
  title?: string;
  badge?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title = 'Queez',
  badge = 'CBT Platform',
}) => {
  const { isElectron, isMax, handleMinimize, handleMaximize, handleClose } = useTitleBar();

  if (!isElectron) return null;

  return (
    <header className="title-bar" onDoubleClick={handleMaximize}>
      <div className="title-bar-drag">
        <span className="title-bar-title">{title}</span>
        {badge && <span className="title-bar-badge">{badge}</span>}
      </div>

      <div className="title-bar-controls">
        <button type="button" className="title-btn" onClick={handleMinimize} title="Minimize" aria-label="Minimize">
          <MinusIcon />
        </button>
        <button type="button" className="title-btn" onClick={handleMaximize} title={isMax ? 'Restore' : 'Maximize'} aria-label={isMax ? 'Restore' : 'Maximize'}>
          {isMax ? <RestoreIcon /> : <SquareIcon />}
        </button>
        <button type="button" className="title-btn title-btn-close" onClick={handleClose} title="Close" aria-label="Close">
          <CloseIcon />
        </button>
      </div>
    </header>
  );
};
