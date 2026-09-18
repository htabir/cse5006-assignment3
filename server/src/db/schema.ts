// Assignment §6: the capsules table. Adapted from the reference SQLite schema for PostgreSQL
// (SERIAL id, BOOLEAN flags, TIMESTAMPTZ) — every required field is retained and user_id holds
// the GitHub user ID taken from the verified JWT.
export const CAPSULES_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS capsules (
  id               SERIAL PRIMARY KEY,
  user_id          TEXT        NOT NULL,
  project_name     TEXT        NOT NULL,
  prompt_title     TEXT        NOT NULL,
  prompt_version   TEXT,
  prompt_text      TEXT        NOT NULL,
  response_summary TEXT,
  category         TEXT,
  usefulness       TEXT,
  reviewed         BOOLEAN     NOT NULL DEFAULT FALSE,
  improved         BOOLEAN     NOT NULL DEFAULT FALSE,
  screenshot_url   TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS capsules_user_id_idx ON capsules (user_id);
`;
