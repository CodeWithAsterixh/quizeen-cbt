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
  const fallback = bakedWhitelabelConfig?.managerName || (bakedWhitelabelConfig?.schoolName ? `${bakedWhitelabelConfig.schoolName} Assessment Manager` : 'Assessment Manager');
  return <SharedTitleBar title={title || fallback} badge={badge} iconUrl={iconUrl} />;
};
