import { pool } from './pool';
import { CAPSULES_SCHEMA_SQL } from './schema';

// Runs on every startup; the schema uses IF NOT EXISTS so this is idempotent.
export async function initDb() {
  await pool.query(CAPSULES_SCHEMA_SQL);
}
