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
