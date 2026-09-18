// All SQL for the capsules table. Every query is scoped by user_id (assignment §9: users can
// only read, update and delete their own records).
import type { CapsuleInput } from '../schemas/capsule';
import type { Capsule } from '../types/capsule';
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

export async function listByUser(userId: string): Promise<Capsule[]> {
  const result = await query<Capsule>(
    'SELECT * FROM capsules WHERE user_id = $1 ORDER BY created_at DESC, id DESC',
    [userId],
  );
  return result.rows;
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
