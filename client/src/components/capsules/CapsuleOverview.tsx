// Overview of all the user's capsules: headline tiles plus three small charts, computed in the
// browser (no extra API calls). Optional feature — not part of the assessed CRUD.
import { AlertTriangle, CheckCircle2, ChevronDown, Circle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { computeStats, percent, type CapsuleStats } from '@/lib/capsuleStats';
import type { Capsule } from '@/types/capsule';

// Single accent hue for magnitude bars (validated for light and dark surfaces).
const ACCENT = '#6366f1';
// Status roles for the usefulness bar — always paired with an icon and a label.
const STATUS = { good: '#0ca30c', warning: '#fab219', neutral: 'var(--muted-foreground)' };

function Tile({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="bg-muted/40 rounded-lg border px-4 py-3">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {detail && <p className="text-muted-foreground text-xs">{detail}</p>}
    </div>
  );
}

function CategoryBars({ stats }: { stats: CapsuleStats }) {
  const max = Math.max(1, ...stats.byCategory.map((c) => c.count));
  return (
    <ul className="space-y-2" aria-label="Records per category">
      {stats.byCategory.map((c) => (
        <li key={c.label} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-2 text-sm">
          <span className="truncate" title={c.label}>
            {c.label}
          </span>
          <div className="bg-muted h-2.5 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full transition-[width]"
              style={{ width: `${(c.count / max) * 100}%`, background: ACCENT }}
              aria-hidden="true"
            />
          </div>
          <span className="text-muted-foreground text-right tabular-nums">{c.count}</span>
        </li>
      ))}
    </ul>
  );
}

function WeeklyColumns({ stats }: { stats: CapsuleStats }) {
  const width = 240;
  const height = 72;
  const gap = 6;
  const n = stats.byWeek.length;
  const colWidth = (width - gap * (n - 1)) / n;
  const max = Math.max(1, ...stats.byWeek.map((w) => w.count));
  const summary = stats.byWeek.map((w) => `${w.label}: ${w.count}`).join(', ');
  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-18 w-full"
        aria-labelledby="weekly-title"
      >
        <title id="weekly-title">{`Capsules added per week, last ${n} weeks. ${summary}`}</title>
        {stats.byWeek.map((w, i) => {
          const h = w.count === 0 ? 2 : Math.max(4, (w.count / max) * (height - 4));
          const x = i * (colWidth + gap);
          return (
            <rect
              key={w.label}
              x={x}
              y={height - h}
              width={colWidth}
              height={h}
              rx={3}
              fill={ACCENT}
              opacity={w.count === 0 ? 0.25 : 1}
            >
              <title>{`Week of ${w.label}: ${w.count}`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="text-muted-foreground mt-1 flex justify-between text-[11px]">
        <span>{stats.byWeek[0]?.label}</span>
        <span>this week</span>
      </div>
    </div>
  );
}

function UsefulnessBar({ stats }: { stats: CapsuleStats }) {
  const segments = [
    { key: 'good', label: 'Good', count: stats.good, color: STATUS.good, Icon: CheckCircle2 },
    {
      key: 'needs',
      label: 'Needs Improvement',
      count: stats.needsImprovement,
      color: STATUS.warning,
      Icon: AlertTriangle,
    },
    { key: 'unrated', label: 'Unrated', count: stats.unrated, color: STATUS.neutral, Icon: Circle },
  ];
  const total = Math.max(1, stats.total);
  return (
    <div>
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
        {segments
          .filter((s) => s.count > 0)
          .map((s) => (
            <div
              key={s.key}
              style={{ width: `${(s.count / total) * 100}%`, background: s.color }}
            />
          ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {segments.map(({ key, label, count, color, Icon }) => (
          <li key={key} className="flex items-center gap-1">
            <Icon className="size-3.5" style={{ color }} aria-hidden="true" />
            <span>{label}</span>
            <span className="text-muted-foreground tabular-nums">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CapsuleOverview({ capsules }: { capsules: Capsule[] }) {
  const stats = useMemo(() => computeStats(capsules), [capsules]);
  // Collapsed by default on phones so the records stay near the top.
  const [open, setOpen] = useState(() => window.matchMedia('(min-width: 640px)').matches);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Overview</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="capsule-overview"
        >
          {open ? 'Hide' : 'Show'}
          <ChevronDown
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </Button>
      </CardHeader>
      {open && (
        <CardContent id="capsule-overview" className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <div className="grid grid-cols-2 gap-3 lg:w-72">
            <Tile label="Capsules" value={String(stats.total)} />
            <Tile
              label="Reviewed"
              value={String(stats.reviewed)}
              detail={percent(stats.reviewed, stats.total)}
            />
            <Tile
              label="Improved"
              value={String(stats.improved)}
              detail={percent(stats.improved, stats.total)}
            />
            <Tile
              label="Rated good"
              value={String(stats.good)}
              detail={`${percent(stats.good, stats.rated)} of ${stats.rated} rated`}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <section>
              <h3 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                By category
              </h3>
              <CategoryBars stats={stats} />
            </section>
            <div className="space-y-6">
              <section>
                <h3 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                  Added per week
                </h3>
                <WeeklyColumns stats={stats} />
              </section>
              <section>
                <h3 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                  Usefulness
                </h3>
                <UsefulnessBar stats={stats} />
              </section>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
