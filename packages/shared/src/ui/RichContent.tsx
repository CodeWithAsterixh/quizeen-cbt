import React from 'react';

export interface RichContentProps {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}

export const RichContent: React.FC<RichContentProps> = ({ html, className = '', style }) => {
  return (
    <div
      className={`rich-content ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
