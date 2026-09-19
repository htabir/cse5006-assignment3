import { useCallback, useEffect, useState } from 'react';
import { listCapsules } from '@/lib/capsules';
import type { Capsule } from '@/types/capsule';

// Loads the caller's capsules from the server for the given query string; refetches when it changes.
export function useCapsules(queryString: string) {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listCapsules(queryString)
      .then((data) => {
        if (cancelled) return;
        setCapsules(data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load capsules');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [queryString, version]);

  // Re-run the current query (after create/update/delete, or a manual retry).
  const reload = useCallback(() => {
    setLoading(true);
    setVersion((v) => v + 1);
  }, []);

  return { capsules, loading, error, reload };
}
