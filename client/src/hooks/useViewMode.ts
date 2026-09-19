import { useCallback, useState } from 'react';

export type ViewMode = 'grid' | 'table';
const STORAGE_KEY = 'ai-capsule:view';

// Per-browser convenience only; falls back to 'grid' when storage is unavailable.
function read(): ViewMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'table' ? 'table' : 'grid';
  } catch {
    return 'grid';
  }
}

export function useViewMode(): [ViewMode, (mode: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>(read);
  const set = useCallback((next: ViewMode) => {
    setMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore — the choice just won't persist
    }
  }, []);
  return [mode, set];
}
