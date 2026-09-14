import { LogEntry } from './types';

export interface GraphBucket {
  label: string;
  count: number;
  avgDuration: number;
  successCount: number;
  errorCount: number;
  topUrl: string;
}

export function computeServerMetrics(logs: LogEntry[]) {
  const total = logs.length;
  const success = logs.filter((l) => l.status < 400).length;
  const error = total - success;
  const successRate = total > 0 ? Math.round((success / total) * 100) : 100;
  const avgDuration = total > 0 ? Math.round(logs.reduce((acc, l) => acc + l.durationMs, 0) / total) : 0;
  const maxDuration = logs.reduce((max, l) => Math.max(max, l.durationMs), 0);

  return { total, success, error, successRate, avgDuration, maxDuration };
}

export function buildGraphBuckets(logs: LogEntry[], maxBuckets = 16): GraphBucket[] {
  if (logs.length === 0) return [];
  const slice = logs.slice(-maxBuckets);
  return slice.map((entry, idx) => ({
    label: entry.timestamp.slice(14, 19) || `#${idx + 1}`,
    count: 1,
    avgDuration: entry.durationMs,
    successCount: entry.status < 400 ? 1 : 0,
    errorCount: entry.status >= 400 ? 1 : 0,
    topUrl: entry.url,
  }));
}
