// Assignment §5/§7: "/dashboard" is protected and lists only the authenticated user's records
// (GET /api/capsules). Search/filtering run on the server; the search box is debounced.
import { useCallback, useMemo, useState } from 'react';
import { CapsuleCard } from '@/components/capsules/CapsuleCard';
import { CapsuleFiltersBar } from '@/components/capsules/CapsuleFilters';
import { CapsuleOverview } from '@/components/capsules/CapsuleOverview';
import { CreateCapsuleDialog } from '@/components/capsules/CreateCapsuleDialog';
import { DeleteCapsuleDialog } from '@/components/capsules/DeleteCapsuleDialog';
import { EditCapsuleDialog } from '@/components/capsules/EditCapsuleDialog';
import { EmptyState } from '@/components/capsules/EmptyState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCapsules } from '@/hooks/useCapsules';
import { useCapsuleStats } from '@/hooks/useCapsuleStats';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  EMPTY_FILTERS,
  isFiltering,
  toQueryString,
  type CapsuleFilters,
} from '@/lib/filterCapsules';

export function Dashboard() {
  const [filters, setFilters] = useState<CapsuleFilters>(EMPTY_FILTERS);
  // Typing in the search box waits 300 ms before hitting the server; selects apply immediately
  // (the debounce only delays when the value keeps changing).
  const debouncedFilters = useDebouncedValue(filters, 300);
  const queryString = useMemo(() => toQueryString(debouncedFilters), [debouncedFilters]);

  const { capsules, loading, error, reload } = useCapsules(queryString);
  const { stats, reload: reloadStats } = useCapsuleStats();
  const filtering = isFiltering(debouncedFilters);
  const total = stats?.total ?? 0;

  // After any create/update/delete, re-run the current query and refresh the overview.
  const onMutated = useCallback(() => {
    reload();
    reloadStats();
  }, [reload, reloadStats]);

  const noRecordsAtAll = !loading && !error && total === 0 && !filtering && capsules.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your capsules</h1>
          {!loading && !error && (
            <p className="text-muted-foreground text-sm">
              {filtering
                ? `${capsules.length} of ${total} ${total === 1 ? 'record' : 'records'}`
                : `${capsules.length} ${capsules.length === 1 ? 'record' : 'records'}`}
            </p>
          )}
        </div>
        <CreateCapsuleDialog onCreated={onMutated} />
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load your capsules</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={reload}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : noRecordsAtAll ? (
        <EmptyState action={<CreateCapsuleDialog onCreated={onMutated} />} />
      ) : (
        <>
          {total > 0 && <CapsuleOverview stats={stats} />}
          <CapsuleFiltersBar value={filters} onChange={setFilters} />
          {loading ? (
            <div
              className="grid gap-4 sm:grid-cols-2"
              aria-busy="true"
              aria-label="Loading capsules"
            >
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-56 w-full" />
              ))}
            </div>
          ) : capsules.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center text-sm">
              No capsules match these filters.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {capsules.map((c) => (
                <CapsuleCard
                  key={c.id}
                  capsule={c}
                  actions={
                    <>
                      <EditCapsuleDialog capsule={c} onUpdated={onMutated} onMissing={onMutated} />
                      <DeleteCapsuleDialog
                        capsule={c}
                        onDeleted={onMutated}
                        onMissing={onMutated}
                      />
                    </>
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
