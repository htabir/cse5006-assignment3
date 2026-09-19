// Filter state for the dashboard. Filtering itself happens on the server (GET /api/capsules?…).
export type StatusFilter = 'all' | 'reviewed' | 'unreviewed' | 'improved' | 'unimproved';

export interface CapsuleFilters {
  query: string;
  category: string; // 'all' or a category value
  usefulness: string; // 'all' or a usefulness value
  status: StatusFilter;
}

export const EMPTY_FILTERS: CapsuleFilters = {
  query: '',
  category: 'all',
  usefulness: 'all',
  status: 'all',
};

export function isFiltering(f: CapsuleFilters): boolean {
  return (
    f.query.trim() !== '' || f.category !== 'all' || f.usefulness !== 'all' || f.status !== 'all'
  );
}

// Translate the UI state into the API's query parameters.
export function toQueryString(f: CapsuleFilters): string {
  const params = new URLSearchParams();
  const q = f.query.trim();
  if (q) params.set('q', q);
  if (f.category !== 'all') params.set('category', f.category);
  if (f.usefulness !== 'all') params.set('usefulness', f.usefulness);
  if (f.status === 'reviewed') params.set('reviewed', 'true');
  if (f.status === 'unreviewed') params.set('reviewed', 'false');
  if (f.status === 'improved') params.set('improved', 'true');
  if (f.status === 'unimproved') params.set('improved', 'false');
  const s = params.toString();
  return s ? `?${s}` : '';
}
