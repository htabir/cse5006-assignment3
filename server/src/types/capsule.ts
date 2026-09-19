// Row shape of the capsules table, returned as-is by the API (snake_case, no mapping layer).
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

// Aggregates for the dashboard overview, computed in SQL for the authenticated user.
export interface CapsuleStats {
  total: number;
  reviewed: number;
  improved: number;
  good: number;
  needs_improvement: number;
  by_category: { label: string; count: number }[];
  by_week: { week_start: string; count: number }[];
}
