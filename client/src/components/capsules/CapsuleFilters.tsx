import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  EMPTY_FILTERS,
  isFiltering,
  type CapsuleFilters,
  type StatusFilter,
} from '@/lib/filterCapsules';
import { CATEGORIES, USEFULNESS } from '@/types/capsule';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Any status' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'unreviewed', label: 'Not reviewed' },
  { value: 'improved', label: 'Improved' },
  { value: 'unimproved', label: 'Not improved' },
];

interface Props {
  value: CapsuleFilters;
  onChange: (next: CapsuleFilters) => void;
  /** Rendered at the end of the bar (e.g. the grid/table toggle). */
  trailing?: React.ReactNode;
}

// Sticks to the top while the list scrolls. On phones the three selects sit behind a "Filters"
// button so the sticky strip stays one row tall.
export function CapsuleFiltersBar({ value, onChange, trailing }: Props) {
  const [showSelects, setShowSelects] = useState(false);
  const set = <K extends keyof CapsuleFilters>(key: K, v: CapsuleFilters[K]) =>
    onChange({ ...value, [key]: v });
  const activeSelects = [value.category, value.usefulness, value.status].filter(
    (v) => v !== 'all',
  ).length;

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-20 -mx-4 border-b px-4 py-3 backdrop-blur">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 basis-56 space-y-1.5">
          <Label htmlFor="capsule-search">Search</Label>
          <div className="relative">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              id="capsule-search"
              type="search"
              placeholder="Title, project, prompt, notes…"
              className="pl-8"
              value={value.query}
              onChange={(e) => set('query', e.target.value)}
            />
          </div>
        </div>

        <div
          className={`${showSelects ? 'flex' : 'hidden'} w-full flex-wrap items-end gap-3 sm:flex sm:w-auto`}
        >
          <div className="space-y-1.5">
            <Label htmlFor="filter-category">Category</Label>
            <Select value={value.category} onValueChange={(v) => set('category', v)}>
              <SelectTrigger id="filter-category" className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-usefulness">Usefulness</Label>
            <Select value={value.usefulness} onValueChange={(v) => set('usefulness', v)}>
              <SelectTrigger id="filter-usefulness" className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any rating</SelectItem>
                {USEFULNESS.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="filter-status">Status</Label>
            <Select value={value.status} onValueChange={(v) => set('status', v as StatusFilter)}>
              <SelectTrigger id="filter-status" className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="sm:hidden"
            onClick={() => setShowSelects((v) => !v)}
            aria-expanded={showSelects}
          >
            <SlidersHorizontal aria-hidden="true" />
            Filters{activeSelects > 0 && ` (${activeSelects})`}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onChange(EMPTY_FILTERS)}
            disabled={!isFiltering(value)}
          >
            <X aria-hidden="true" />
            Clear
          </Button>
          {trailing}
        </div>
      </div>
    </div>
  );
}
