// Headline numbers and chart series derived in the browser from the loaded capsule list.
import type { Capsule } from '@/types/capsule';

export interface CategoryCount {
  label: string;
  count: number;
}

export interface WeekCount {
  weekStart: Date;
  label: string;
  count: number;
}

export interface CapsuleStats {
  total: number;
  reviewed: number;
  improved: number;
  rated: number;
  good: number;
  needsImprovement: number;
  unrated: number;
  byCategory: CategoryCount[];
  byWeek: WeekCount[];
}

const WEEKS = 8;
const UNCATEGORISED = 'Uncategorised';

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d;
}

const weekLabel = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });

export function computeStats(capsules: Capsule[], now = new Date()): CapsuleStats {
  const byCategoryMap = new Map<string, number>();
  let reviewed = 0;
  let improved = 0;
  let good = 0;
  let needsImprovement = 0;

  for (const c of capsules) {
    if (c.reviewed) reviewed++;
    if (c.improved) improved++;
    if (c.usefulness === 'Good') good++;
    else if (c.usefulness === 'Needs Improvement') needsImprovement++;
    const key = c.category?.trim() || UNCATEGORISED;
    byCategoryMap.set(key, (byCategoryMap.get(key) ?? 0) + 1);
  }

  const byCategory = [...byCategoryMap]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const thisWeek = startOfWeek(now);
  const byWeek: WeekCount[] = Array.from({ length: WEEKS }, (_, i) => {
    const weekStart = new Date(thisWeek);
    weekStart.setDate(thisWeek.getDate() - (WEEKS - 1 - i) * 7);
    return { weekStart, label: weekLabel.format(weekStart), count: 0 };
  });
  for (const c of capsules) {
    const created = startOfWeek(new Date(c.created_at));
    const bucket = byWeek.find((w) => w.weekStart.getTime() === created.getTime());
    if (bucket) bucket.count++;
  }

  const rated = good + needsImprovement;
  return {
    total: capsules.length,
    reviewed,
    improved,
    rated,
    good,
    needsImprovement,
    unrated: capsules.length - rated,
    byCategory,
    byWeek,
  };
}

export function percent(part: number, whole: number): string {
  return whole === 0 ? '0%' : `${Math.round((part / whole) * 100)}%`;
}
