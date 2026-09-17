import React, { useMemo } from 'react';
import { parseComplexWriting } from './equation-parser.js';
import './styles/equation.css';

export interface RichContentProps {
  html: string;
  inline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const RichContent: React.FC<RichContentProps> = ({
  html,
  inline = false,
  className = '',
  style,
}) => {
  const parsed = useMemo(() => parseComplexWriting(html), [html]);
  const Component = inline ? 'span' : 'div';

  return (
    <Component
      className={`rich-content ${inline ? 'rich-content-inline' : ''} ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: parsed }}
    />
  );
};
