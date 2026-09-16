export function formatDateTimeNice(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function getAvailabilityPhrase(isAvailable: boolean, from?: string, to?: string): string {
  if (!isAvailable) return 'Unavailable (Hidden from students)';
  if (from && to) return `Available from ${formatDateTimeNice(from)} to ${formatDateTimeNice(to)}`;
  if (from) return `Available starting ${formatDateTimeNice(from)}`;
  if (to) return `Available until ${formatDateTimeNice(to)}`;
  return 'Available (Active now)';
}

export function getAudiencePhrase(classes: string[], level?: string, department?: string): string {
  const clsStr = classes && classes.length > 0 ? classes.join(', ') : 'All Classes';
  const deptStr = department ? ` (${department.toUpperCase()})` : '';
  const lvlStr = level ? ` [${level.replace('_', ' ')}]` : '';
  return `${clsStr}${deptStr}${lvlStr}`;
}

export function getTimingPhrase(durationMinutes: number, passingScore: number, assessmentType?: string): string {
  const typeStr = assessmentType ? assessmentType.toUpperCase() : 'TEST';
  return `${durationMinutes} mins | Pass score ${passingScore}% | Type: ${typeStr}`;
}

export function getShufflingPhrase(shuffleQ: boolean, shuffleOpt: boolean, pin?: string): string {
  const qStr = `Questions: ${shuffleQ ? 'Enabled' : 'Disabled'}`;
  const optStr = `Options: ${shuffleOpt ? 'Enabled' : 'Disabled'}`;
  const pinStr = pin ? ` | PIN: ${pin}` : '';
  return `${qStr}, ${optStr}${pinStr}`;
}
