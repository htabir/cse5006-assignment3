import { Search, X } from 'lucide-react';
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
}

export function CapsuleFiltersBar({ value, onChange }: Props) {
  const set = <K extends keyof CapsuleFilters>(key: K, v: CapsuleFilters[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto_auto] sm:items-end">
      <div className="space-y-1.5">
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

      <Button
        type="button"
        variant="ghost"
        onClick={() => onChange(EMPTY_FILTERS)}
        disabled={!isFiltering(value)}
      >
        <X aria-hidden="true" />
        Clear
      </Button>
    </div>
  );
}
