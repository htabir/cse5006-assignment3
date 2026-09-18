import { Pool, type QueryResultRow } from 'pg';
import { config } from '../config';

// One shared connection pool. TLS is decided by the connection string (append ?sslmode=require
// for a hosted database); the VPS database is reached over loopback without TLS.
export const pool = new Pool({ connectionString: config.databaseUrl });

export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  return pool.query<T>(text, params);
}
