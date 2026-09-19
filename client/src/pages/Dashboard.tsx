// Assignment §5/§7: "/dashboard" is protected and lists only the authenticated user's records
// (GET /api/capsules). Search and filtering are client-side over that list (optional feature).
import { useMemo, useState } from 'react';
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
import {
  EMPTY_FILTERS,
  filterCapsules,
  isFiltering,
  type CapsuleFilters,
} from '@/lib/filterCapsules';

export function Dashboard() {
  const { capsules, loading, error, reload, add, replace, remove } = useCapsules();
  const [filters, setFilters] = useState<CapsuleFilters>(EMPTY_FILTERS);
  const visible = useMemo(() => filterCapsules(capsules, filters), [capsules, filters]);
  const filtering = isFiltering(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your capsules</h1>
          {!loading && !error && (
            <p className="text-muted-foreground text-sm">
              {filtering
                ? `${visible.length} of ${capsules.length} ${capsules.length === 1 ? 'record' : 'records'}`
                : `${capsules.length} ${capsules.length === 1 ? 'record' : 'records'}`}
            </p>
          )}
        </div>
        <CreateCapsuleDialog onCreated={add} />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2" aria-busy="true" aria-label="Loading capsules">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Could not load your capsules</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => void reload()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : capsules.length === 0 ? (
        <EmptyState action={<CreateCapsuleDialog onCreated={add} />} />
      ) : (
        <>
          <CapsuleOverview capsules={capsules} />
          <CapsuleFiltersBar value={filters} onChange={setFilters} />
          {visible.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center text-sm">
              No capsules match these filters.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {visible.map((c) => (
                <CapsuleCard
                  key={c.id}
                  capsule={c}
                  actions={
                    <>
                      <EditCapsuleDialog capsule={c} onUpdated={replace} onMissing={reload} />
                      <DeleteCapsuleDialog capsule={c} onDeleted={remove} onMissing={reload} />
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
