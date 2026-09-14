import React from 'react';
import { TitleBar as SharedTitleBar } from '@cbt/shared';

interface TitleBarProps {
  title?: string;
  badge?: string;
  iconUrl?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title = 'Queez',
  badge = 'Student Portal',
  iconUrl,
}) => {
  return <SharedTitleBar title={title} badge={badge} iconUrl={iconUrl} />;
};
