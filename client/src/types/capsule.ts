// Mirrors server/src/types/capsule.ts and the zod schema — kept identical by hand (no cross-workspace import).
export interface Capsule {
  id: number;
  user_id: string;
  project_name: string;
  prompt_title: string;
  prompt_version: string | null;
  prompt_text: string;
  response_summary: string | null;
  category: string | null;
  usefulness: string | null;
  reviewed: boolean;
  improved: boolean;
  screenshot_url: string | null;
  notes: string | null;
  created_at: string;
}

export type CapsuleInput = Omit<Capsule, 'id' | 'user_id' | 'created_at'>;

export const CATEGORIES = ['Coding', 'Writing', 'Research', 'Debugging', 'Study', 'Other'] as const;
export const USEFULNESS = ['Good', 'Needs Improvement'] as const;
