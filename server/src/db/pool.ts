import { Pool, type QueryResultRow } from 'pg';
import { config } from '../config';

// One shared connection pool. Neon (production) requires TLS; local Postgres does not.
export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: config.isProd ? { rejectUnauthorized: false } : undefined,
});

export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  return pool.query<T>(text, params);
}
