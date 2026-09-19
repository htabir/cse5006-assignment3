// Presentation helpers for the server-computed overview stats.
import type { CapsuleStats } from '@/types/capsule';

export function percent(part: number, whole: number): string {
  return whole === 0 ? '0%' : `${Math.round((part / whole) * 100)}%`;
}

const weekLabel = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });

// Interpret the server's 'YYYY-MM-DD' (UTC Monday) as a calendar date, not a timestamp.
export function formatWeek(weekStart: string): string {
  const [y, m, d] = weekStart.split('-').map(Number);
  return weekLabel.format(new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1));
}

export function ratedCount(stats: CapsuleStats): number {
  return stats.good + stats.needs_improvement;
}
