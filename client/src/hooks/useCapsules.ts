import { useCallback, useEffect, useState } from 'react';
import { listCapsules } from '@/lib/capsules';
import type { Capsule } from '@/types/capsule';

export function useCapsules() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State updates happen in promise callbacks (never synchronously in the mount effect).
  const load = useCallback(
    () =>
      listCapsules()
        .then((data) => {
          setCapsules(data);
          setError(null);
        })
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : 'Failed to load capsules');
        })
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  // Manual retry from the UI.
  const reload = useCallback(() => {
    setLoading(true);
    return load();
  }, [load]);

  // Local list updates after a successful create/update/delete, so the UI reflects the API result
  // without a second round-trip.
  const add = useCallback((c: Capsule) => setCapsules((list) => [c, ...list]), []);
  const replace = useCallback(
    (c: Capsule) => setCapsules((list) => list.map((x) => (x.id === c.id ? c : x))),
    [],
  );
  const remove = useCallback(
    (id: number) => setCapsules((list) => list.filter((x) => x.id !== id)),
    [],
  );

  return { capsules, loading, error, reload, add, replace, remove };
}
