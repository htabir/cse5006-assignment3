import { useCallback, useEffect, useState } from 'react';
import { getCapsuleStats } from '@/lib/capsules';
import type { CapsuleStats } from '@/types/capsule';

export function useCapsuleStats() {
  const [stats, setStats] = useState<CapsuleStats | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getCapsuleStats()
      .then((data) => !cancelled && setStats(data))
      .catch(() => !cancelled && setStats(null));
    return () => {
      cancelled = true;
    };
  }, [version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { stats, reload };
}
