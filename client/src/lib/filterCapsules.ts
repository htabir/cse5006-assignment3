// Client-side search and filtering over the records already loaded from GET /api/capsules.
import type { Capsule } from '@/types/capsule';

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

const SEARCHED_FIELDS: (keyof Capsule)[] = [
  'prompt_title',
  'project_name',
  'prompt_text',
  'response_summary',
  'notes',
  'prompt_version',
];

export function filterCapsules(capsules: Capsule[], f: CapsuleFilters): Capsule[] {
  const q = f.query.trim().toLowerCase();
  return capsules.filter((c) => {
    if (f.category !== 'all' && c.category !== f.category) return false;
    if (f.usefulness !== 'all' && c.usefulness !== f.usefulness) return false;
    if (f.status === 'reviewed' && !c.reviewed) return false;
    if (f.status === 'unreviewed' && c.reviewed) return false;
    if (f.status === 'improved' && !c.improved) return false;
    if (f.status === 'unimproved' && c.improved) return false;
    if (
      q &&
      !SEARCHED_FIELDS.some((k) =>
        String(c[k] ?? '')
          .toLowerCase()
          .includes(q),
      )
    )
      return false;
    return true;
  });
}
