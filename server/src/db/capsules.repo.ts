// All SQL for the capsules table. Every query is scoped by user_id (assignment §9: users can
// only read, update and delete their own records).
import type { CapsuleInput, ListQuery } from '../schemas/capsule';
import type { Capsule, CapsuleStats } from '../types/capsule';
import { query } from './pool';

const COLUMNS =
  'project_name, prompt_title, prompt_version, prompt_text, response_summary, category, usefulness, reviewed, improved, screenshot_url, notes';

// Blank optional text from the form is stored as NULL, not ''.
const textOrNull = (v: string | null | undefined) => (v && v.trim() ? v : null);

function values(input: CapsuleInput) {
  return [
    input.project_name,
    input.prompt_title,
    textOrNull(input.prompt_version),
    input.prompt_text,
    textOrNull(input.response_summary),
    textOrNull(input.category),
    textOrNull(input.usefulness),
    input.reviewed,
    input.improved,
    textOrNull(input.screenshot_url),
    textOrNull(input.notes),
  ];
}

const SEARCHED_COLUMNS = [
  'prompt_title',
  'project_name',
  'prompt_text',
  'response_summary',
  'notes',
  'prompt_version',
];

// Ownership is always the first predicate; the optional filters only narrow the user's own rows.
export async function listByUser(userId: string, filters: ListQuery = {}): Promise<Capsule[]> {
  const where = ['user_id = $1'];
  const params: unknown[] = [userId];
  // Every '?' in the clause refers to the same (single) parameter.
  const add = (clause: string, value: unknown) => {
    params.push(value);
    where.push(clause.replace(/\?/g, `$${params.length}`));
  };

  if (filters.q) {
    // Escape LIKE wildcards so the user's text is matched literally (backslash is the default escape).
    const literal = filters.q.replace(/[\\%_]/g, '\\$&');
    add(`(${SEARCHED_COLUMNS.map((c) => `${c} ILIKE ?`).join(' OR ')})`, `%${literal}%`);
  }
  if (filters.category) add('category = ?', filters.category);
  if (filters.usefulness) add('usefulness = ?', filters.usefulness);
  if (filters.reviewed !== undefined) add('reviewed = ?', filters.reviewed);
  if (filters.improved !== undefined) add('improved = ?', filters.improved);

  const result = await query<Capsule>(
    `SELECT * FROM capsules WHERE ${where.join(' AND ')} ORDER BY created_at DESC, id DESC`,
    params,
  );
  return result.rows;
}

export async function statsByUser(userId: string): Promise<CapsuleStats> {
  const totals = await query<{
    total: string;
    reviewed: string;
    improved: string;
    good: string;
    needs_improvement: string;
  }>(
    `SELECT count(*)::text AS total,
            count(*) FILTER (WHERE reviewed)::text AS reviewed,
            count(*) FILTER (WHERE improved)::text AS improved,
            count(*) FILTER (WHERE usefulness = 'Good')::text AS good,
            count(*) FILTER (WHERE usefulness = 'Needs Improvement')::text AS needs_improvement
     FROM capsules WHERE user_id = $1`,
    [userId],
  );
  const byCategory = await query<{ label: string; count: string }>(
    `SELECT COALESCE(NULLIF(trim(category), ''), 'Uncategorised') AS label, count(*)::text AS count
     FROM capsules WHERE user_id = $1
     GROUP BY 1 ORDER BY count(*) DESC, 1 ASC`,
    [userId],
  );
  // Last 8 ISO weeks (Monday-based, UTC), zero-filled.
  const byWeek = await query<{ week_start: string; count: string }>(
    `WITH weeks AS (
       SELECT generate_series(
         date_trunc('week', now() AT TIME ZONE 'UTC') - interval '7 weeks',
         date_trunc('week', now() AT TIME ZONE 'UTC'),
         interval '1 week') AS week_start)
     SELECT to_char(w.week_start, 'YYYY-MM-DD') AS week_start,
            count(c.id)::text AS count
     FROM weeks w
     LEFT JOIN capsules c
       ON c.user_id = $1
      AND date_trunc('week', c.created_at AT TIME ZONE 'UTC') = w.week_start
     GROUP BY w.week_start ORDER BY w.week_start`,
    [userId],
  );
  const t = totals.rows[0];
  return {
    total: Number(t?.total ?? 0),
    reviewed: Number(t?.reviewed ?? 0),
    improved: Number(t?.improved ?? 0),
    good: Number(t?.good ?? 0),
    needs_improvement: Number(t?.needs_improvement ?? 0),
    by_category: byCategory.rows.map((r) => ({ label: r.label, count: Number(r.count) })),
    by_week: byWeek.rows.map((r) => ({ week_start: r.week_start, count: Number(r.count) })),
  };
}

export async function createForUser(userId: string, input: CapsuleInput): Promise<Capsule> {
  const result = await query<Capsule>(
    `INSERT INTO capsules (user_id, ${COLUMNS})
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING *`,
    [userId, ...values(input)],
  );
  return result.rows[0] as Capsule;
}

export async function updateOwned(
  userId: string,
  id: number,
  input: CapsuleInput,
): Promise<Capsule | null> {
  const result = await query<Capsule>(
    `UPDATE capsules
     SET project_name = $3, prompt_title = $4, prompt_version = $5, prompt_text = $6,
         response_summary = $7, category = $8, usefulness = $9, reviewed = $10, improved = $11,
         screenshot_url = $12, notes = $13
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId, ...values(input)],
  );
  return result.rows[0] ?? null;
}

export async function deleteOwned(userId: string, id: number): Promise<boolean> {
  const result = await query('DELETE FROM capsules WHERE id = $1 AND user_id = $2', [id, userId]);
  return result.rowCount === 1;
}
