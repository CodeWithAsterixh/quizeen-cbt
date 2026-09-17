import { TitleBar as SharedTitleBar, bakedWhitelabelConfig } from '@cbt/shared';

interface TitleBarProps {
  title?: string;
  badge?: string;
  iconUrl?: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  badge,
  iconUrl,
}) => {
  const fallback = bakedWhitelabelConfig?.studentName || (bakedWhitelabelConfig?.schoolName ? `${bakedWhitelabelConfig.schoolName} Student Portal` : 'Student Portal');
  return <SharedTitleBar title={title || fallback} badge={badge} iconUrl={iconUrl} />;
};
